// config/storage.js
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/licenses')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `license-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF, PNG, and JPG files are allowed!'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

export default upload
