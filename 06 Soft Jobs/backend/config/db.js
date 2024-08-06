// config/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres', // Reemplaza con tu usuario
  host: 'localhost',
  database: 'softjobs',
  password: 'omega', // Reemplaza con tu contraseña
  port: 5432,
});

export default pool;
