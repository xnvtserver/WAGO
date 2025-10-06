// Backend/settingsPage/controller/settingsController.js

import knex from '../../db/knex.js';

// Store Information
export const getStoreInfo = async (req, res) => {
  try {
    const shop = await knex('shops')
      .where({ id: req.user.shop_id })
      .first();
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStoreInfo = async (req, res) => {
  try {
    const [updated] = await knex('shops')
      .where({ id: req.user.shop_id, owner_id: req.user.id })
      .update(req.body)
      .returning('*');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Management
export const getShopUsers = async (req, res) => {
  try {
    const users = await knex('users')
      .join('shop_permissions', 'users.id', 'shop_permissions.user_id')
      .where('shop_permissions.shop_id', req.user.shop_id)
      .select('users.*', 'shop_permissions.role as shop_role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createShopUser = async (req, res) => {
  try {
    await knex.transaction(async trx => {
      const [user] = await trx('users')
        .insert({ ...req.body, role: 'employee' })
        .returning('*');

      await trx('shop_permissions').insert({
        user_id: user.id,
        shop_id: req.user.shop_id,
        role: req.body.shop_role,
        permissions: knex.raw('?::permission_type[]', [req.body.permissions])
      });

      res.status(201).json(user);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tax Settings
export const getTaxSettings = async (req, res) => {
  try {
    const settings = await knex('shops')
      .where({ id: req.user.shop_id })
      .select('tax_inclusive', 'tax_on_shipping', 'tax_rates');
    res.json(settings[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaxSettings = async (req, res) => {
  try {
    const [updated] = await knex('shops')
      .where({ id: req.user.shop_id })
      .update({
        tax_inclusive: req.body.inclusive,
        tax_on_shipping: req.body.shippingTax,
        tax_rates: JSON.stringify(req.body.rates)
      })
      .returning('*');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


