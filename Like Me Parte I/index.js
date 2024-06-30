import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  database: 'likeme',
  allowExitOnIdle: true,
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los posts');
  }
});

app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)',
      [titulo, url, descripcion]
    );
    res.status(201).send('Post agregado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el post');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
