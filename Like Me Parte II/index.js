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
  password: 'XXXXXXXXXXXXXXX',
  database: 'likeme',
  allowExitOnIdle: true,
});

// Servir archivos estáticos desde el directorio dist
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta para obtener los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los posts');
  }
});

// Ruta para agregar un post
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

// Ruta para modificar un post
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, url, descripcion, likes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE posts SET titulo = $1, img = $2, descripcion = $3, likes = $4 WHERE id = $5',
      [titulo, url, descripcion, likes, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Post no encontrado');
    }
    res.send('Post modificado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al modificar el post');
  }
});

// Ruta para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Post no encontrado');
    }
    res.send('Post eliminado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el post');
  }
});

// Ruta para aumentar likes
app.put('/posts/like/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Post no encontrado');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al aumentar el like');
  }
});

// Ruta para servir el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
