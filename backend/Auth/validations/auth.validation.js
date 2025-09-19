// auth/validations/auth.validation.js
import Joi from 'joi'

export const registerSchema = Joi.object({
  shopName: Joi.string().required().label('Shop Name'),
  ownerName: Joi.string().required().label('Owner Name'),
  email: Joi.string().email().required(),
  phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  agreeTerms: Joi.boolean().valid(true).required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
