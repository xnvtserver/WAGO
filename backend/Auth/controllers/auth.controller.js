//backend/auth/controllers/auth.controller.js
import db from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Login function for authentication
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db('users')
      .where('email', email)
      .select('id', 'name', 'email', 'password_hash', 'role')
      .first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({
      id: user.id,
      shop_id: currentShopId,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '12h' });

    let shops = [];
    if (user.role === 'owner') {
      shops = await db('shops')
        .where('owner_id', user.id)
        .select('id', 'name', 'location', 'status');
    } else if (user.role === 'employee') {
      shops = await db('shop_permissions')
        .where('user_id', user.id)
        .join('shops', 'shop_permissions.shop_id', 'shops.id')
        .select('shops.id', 'shops.name', 'shops.location', 'shop_permissions.role as shop_role');
    }

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      shops
    });

  } catch (error) {
    console.error('Login error:', error.stack || error);
    return res.status(500).json({
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Register function for new users
export const register = async (req, res) => {
  console.log('Register request body:', req.body);
  const {
    fullName,         // frontend → maps to users.name
    role,             // frontend → maps to users.role
    department,       // frontend → maps to shops.name (shopName)
    userId,           // frontend → maps to shops.location
    email,
    phone,
    password,
    confirmPassword,
    acceptedTerms
  } = req.body;

  const licenseFile = req.file;

console.log('--- Incoming Register Data ---');
console.log('fullName:', fullName);
console.log('department:', department);
console.log('email:', email);
console.log('phone:', phone);
console.log('password:', password);
console.log('confirmPassword:', confirmPassword);
console.log('userId (location):', userId);
console.log('acceptedTerms:', acceptedTerms);


  try {
    if (!fullName || !department || !email || !phone || !password || !userId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const trx = await db.transaction();

    try {
      // Insert user
      const insertedUser = await trx('users').insert({
        name: fullName,
        email,
        password_hash: await bcrypt.hash(password, 10),
        phone,
        license_file: licenseFile?.filename || null,
        terms_accepted: acceptedTerms === 'true' || acceptedTerms === true,
        role: role || 'owner'   // fallback to 'owner' if not passed
      }).returning('id');

      // const userIdInserted = insertedUser[0].id;

      // // Insert shop
      // const insertedShop = await trx('shops').insert({
      //   name: department,    // shopName
      //   location: userId,    // using userId as location
      //   phone,
      //   email,
      //   owner_id: userIdInserted,
      //   status: 'active'
      // }).returning('id');

      // const shopId = insertedShop[0].id;

      // // Self parent_shop_id
      // await trx('shops')
      //   .where({ id: shopId })
      //   .update({ parent_shop_id: shopId });

      await trx.commit();

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          // id: userIdInserted,
          name: fullName,
          email,
          phone,
          role: role || 'owner'
        }
      });
    } catch (error) {
      await trx.rollback();
      console.error('Transaction error:', error);

      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Email or phone already registered'
        });
      }

      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Token validation function for validating the JWT
export const validateToken = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // If token is valid, return success
    return res.status(200).json({ message: 'Token is valid', user: decoded });
  });
};
