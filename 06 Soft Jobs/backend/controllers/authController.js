// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Exporta SECRET_KEY
export const SECRET_KEY = 'desafiolatam'; // Llave secreta segura

// Registro de usuarios
export const register = async (req, res) => {
  const { email, password, rol, lenguage } = req.body;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, rol, lenguage]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Inicio de sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    // Comparar la contraseña
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear token JWT
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Obtener datos del usuario autenticado
export const getUser = async (req, res) => {
  const email = req.user.email;

  try {
    const result = await pool.query('SELECT email, rol, lenguage FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};
