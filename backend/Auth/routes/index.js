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

      // ✅ Build JWT payload without shop stuff
      const payload = {
        id: user.id,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

      // ✅ Response without shops/permissions
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message:
          'ലോഗിൻ പരാജയപ്പെട്ടു. നിങ്ങളുടെ ഇമെയിലും പാസ്വേഡും പരിശോധിക്കുകയോ പിന്നീടു വീണ്ടും ശ്രമിക്കുകയോ ചെയ്യൂ.',
      });
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
