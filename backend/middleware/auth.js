// Backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const verifyShopOwner = async (req, res, next) => {
    try {
        const user = req.user; // Ensure req.user is available
        const shopId = req.params.shopId;

        const shop = await db('shops')
            .where({ id: shopId, owner_id: user.id })
            .first();

        if (!shop) {
            return res.status(403).json({
                error: 'Access denied: Not shop owner'
            });
        }

        next();
    } catch (error) {
        console.error('Error in verifyShopOwner middleware:', error);
        res.status(401).json({ error: 'Authorization failed' });
    }
};

export const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT Payload in middleware:', decoded);
        console.log('Request : ', req.name); // This will likely still be undefined

        // Fetch user
        const user = await db('users')
            .where({ id: decoded.id })
            .first();

        if (!user) {
            console.log('User Not Found while checking middleware');
            return res.status(401).json({ message: 'User not found' });
        }

        // If not owner, check shop_permissions
        let permissions = [];
        if (user.role !== 'owner') {
            const permissionRecord = await db('shop_permissions')
                .where({
                    user_id: decoded.id,
                    shop_id: decoded.shop_id
                })
                .first();

            if (!permissionRecord) {
                console.log('Permissions not found for employee in shop');
                return res.status(401).json({ message: 'User not assigned to this shop' });
            }

            permissions = permissionRecord.permissions || [];
        }

        // Attach user to request
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions,
            shop_id: decoded.shop_id
        };

        next();

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorize = (requiredPermissions = []) => {
    return (req, res, next) => {
        // First check role if specified
        if (requiredPermissions.some(p => p.startsWith('role:'))) {
            const requiredRoles = requiredPermissions
                .filter(p => p.startsWith('role:'))
                .map(p => p.split(':')[1]);

            if (!requiredRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Insufficient role privileges' });
            }
        }

        // Then check permissions
        const requiredPerms = requiredPermissions.filter(p => !p.startsWith('role:'));
        if (requiredPerms.length > 0) {
            const hasPermissions = requiredPerms.every(perm =>
                req.user.permissions.includes(perm)
            );

            if (!hasPermissions) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }
        }

        next();
    };
};