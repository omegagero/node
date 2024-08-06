// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../controllers/authController.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido' });
    }

    req.user = user;
    next();
  });
};
