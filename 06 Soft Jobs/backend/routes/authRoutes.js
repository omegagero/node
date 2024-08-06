// routes/authRoutes.js
import express from 'express';
import { register, login, getUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define las rutas con el prefijo correcto
router.post('/usuarios', register);
router.post('/login', login);
router.get('/usuarios', verifyToken, getUser);

export default router;
