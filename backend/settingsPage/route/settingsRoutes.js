// Backend/settingsPage/route/settingsRoutes.js

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import * as settingsController from '../controller/settingController.js';
import db from '../../config/db.js';

const router = Router();


// Get all users with their associated shops, employee profiles, and permissions
router.get('/settings/users', authenticate, async (req, res) => {
  try {
    const users = await db('users')
      .leftJoin('shops', 'users.id', 'shops.owner_id')
      .leftJoin('employee_profiles', 'users.id', 'employee_profiles.user_id')
      .leftJoin('shop_permissions', 'users.id', 'shop_permissions.user_id')
      .select(
        'users.id as user_id',
        'users.name',
        'users.email',
        'users.role',
        'shops.id as shop_id',
        'shops.name as shop_name',
        'employee_profiles.id as profile_id',
        'employee_profiles.is_active as profile_active',
        'employee_profiles.managed_by as profile_manager_id',
        'shop_permissions.shop_id as permission_shop_id',
        'shop_permissions.role as permission_role'
      );

    // Group and shape the user data
    const groupedUsers = users.reduce((acc, user) => {
      if (!acc[user.user_id]) {
        acc[user.user_id] = {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          shops: [],
          profiles: [],
          permissions: []
        };
      }

      if (user.shop_id && !acc[user.user_id].shops.some(s => s.shop_id === user.shop_id)) {
        acc[user.user_id].shops.push({
          shop_id: user.shop_id,
          shop_name: user.shop_name
        });
      }

      if (user.profile_id && !acc[user.user_id].profiles.some(p => p.profile_id === user.profile_id)) {
        acc[user.user_id].profiles.push({
          profile_id: user.profile_id,
          is_active: user.profile_active,
          managed_by: user.profile_manager_id
        });
      }

      if (user.permission_shop_id && !acc[user.user_id].permissions.some(p => p.shop_id === user.permission_shop_id)) {
        acc[user.user_id].permissions.push({
          shop_id: user.permission_shop_id,
          role: user.permission_role
        });
      }

      return acc;
    }, {});

    res.json(Object.values(groupedUsers));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
//for Add User
router.post('/settings/users', authenticate, async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [newUser] = await db('users')
      .insert({
        name,
        email,
        role,
        password_hash: 'placeholder', // You'll likely handle this differently
        phone: '000-000-0000', // Placeholder if needed
      })
      .returning(['id', 'name', 'email', 'role']);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});
// for Edit User
router.put('/settings/users/:id', authenticate, async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  try {
    const [updatedUser] = await db('users')
      .where({ id })
      .update({ name, email, role, updated_at: new Date() })
      .returning(['id', 'name', 'email', 'role']);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});
//for  Remove User
router.delete('/settings/users/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('users').where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// Store Info
router.get('/store',
  authenticate,
  authorize(['view_settings']),
  settingsController.getStoreInfo
);

router.put('/store',
  authenticate,
  authorize(['manage_settings']),
  settingsController.updateStoreInfo
);

// User Management
router.get('/users',
  authenticate,
  authorize(['manage_users']),
  settingsController.getShopUsers
);

router.post('/users',
  authenticate,
  authorize(['manage_users']),
  settingsController.createShopUser
);

// Tax Settings
router.get('/tax',
  authenticate,
  authorize(['manage_tax']),
  settingsController.getTaxSettings
);

router.put('/tax',
  authenticate,
  authorize(['manage_tax']),
  settingsController.updateTaxSettings
);



export default router;
