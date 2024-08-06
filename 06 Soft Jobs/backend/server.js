// server.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// Rutas
app.use('/api', authRoutes); //'/api' esté configurado aquí

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
