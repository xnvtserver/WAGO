// config/constants.js
import dotenv from 'dotenv'

dotenv.config()

export default {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || './uploads',
}
