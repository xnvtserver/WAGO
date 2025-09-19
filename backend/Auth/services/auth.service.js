// Auth/services/auth.service.js
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import config from '../../config/constants.js'
import bcrypt from 'bcryptjs'

/**
 * Register a new user
 * @param {Object} userData 
 * @param {Object} licenseFile 
 */
async function registerUser(userData, licenseFile) {
  // check for existing email
  const existingUser = await User.findByEmail(userData.email)
  if (existingUser) {
    throw new Error('Email already exists')
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  // create & return the user record
  return User.create({
    shop_name:     userData.shopName,
    owner_name:    userData.ownerName,
    email:         userData.email,
    phone:         userData.phone,
    password_hash: hashedPassword,
    license_file:  licenseFile?.filename,
    terms_accepted:userData.agreeTerms
  })
}

/**
 * Log in an existing user
 * @param {string} email 
 * @param {string} password 
 */
async function loginUser(email, password) {
  // find user by email
  const user = await User.findByEmail(email)
  if (!user) {
    throw new Error('Invalid credentials')
  }

  // verify password
  const isValid = await User.comparePassword(password, user.password_hash)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  // sign JWT
const token = jwt.sign({
  id: user.id,
  shop_id: currentShopId,  // Add current shop ID
  role: user.role
}, process.env.JWT_SECRET, { expiresIn: '12h' });

  // return user info + token
  return {
    user: {
      id:         user.id,
      shopName:   user.shop_name,
      ownerName:  user.owner_name,
      email:      user.email,
      phone:      user.phone
    },
    token
  }
}

export default {
  registerUser,
  loginUser
}
