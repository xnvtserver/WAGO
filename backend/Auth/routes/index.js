// Backend/Auth/routes/index.js
import { Router } from 'express';
import { login, register, validateToken } from '../controllers/auth.controller.js';
import fileUpload from '../../config/storage.js';
import { validateLogin } from '../middleware/validation.js';
import db from '../../config/db.js'; // Import your database connection
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Make sure jsonwebtoken is imported

const router = Router();

router.post(
  '/login',
  validateLogin,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await db('users').where('email', email).first();

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      let currentShopId = null;
      let userShops = [];
      let permissions = [];

      if (user.role === 'owner') {
        // Get owned shops and auto-grant all permissions
        userShops = await db('shops').where('owner_id', user.id);
        currentShopId = userShops.length > 0 ? userShops[0].id : null;
        permissions = []; // Frontend will handle owner permissions
      } else if (user.role === 'employee') {
        // Get shops with permissions
        userShops = await db('shop_permissions')
          .where('user_id', user.id)
          .join('shops', 'shop_permissions.shop_id', 'shops.id')
          .select(
            'shops.*',
            'shop_permissions.permissions',
            'shop_permissions.role as shop_role'
          );

        if (userShops.length > 0) {
          currentShopId = userShops[0].id;
          permissions = userShops[0].permissions || [];
        }
      }

      if (!currentShopId && user.role !== 'customer') {
        return res.status(400).json({ message: 'User is not associated with a shop.' });
      } else if (user.role === 'customer') {
        currentShopId = null;
      }

      const payload = {
        id: user.id,
        role: user.role,
        shop_id: currentShopId,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          shop_id: currentShopId,
        },
        shops: userShops,
        permissions // Include permissions in response
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'ലോഗിൻ പരാജയപ്പെട്ടു. നിങ്ങളുടെ ഇമെയിലും പാസ്വേഡും പരിശോധിക്കുകയോ പിന്നീടു വീണ്ടും ശ്രമിക്കുകയോ ചെയ്യൂ.' });
    }
  }
);

// Register route with file upload (licenseFile)
router.post(
  '/register',
  fileUpload.single('licenseFile'),
  register
);

router.get('/validate', validateToken);

export default router;
