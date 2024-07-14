const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joyas',
  password: 'XXXXXXXXXXXXXXXXXXX',
  port: 5432,
});

// Ruta GET /joyas
router.get('/', async (req, res, next) => {
  try {
    const { limits, page, order_by } = req.query;
    const limit = parseInt(limits, 10) || 10;
    const offset = (parseInt(page, 10) - 1) * limit || 0;
    const order = order_by ? order_by.replace('_', ' ') : 'id ASC';

    const query = `
      SELECT * FROM inventario
      ORDER BY ${order}
      LIMIT $1 OFFSET $2
    `;
    const values = [limit, offset];

    const result = await pool.query(query, values);

    const response = {
      data: result.rows,
      links: {
        self: req.originalUrl,
        next: `/joyas?limits=${limit}&page=${parseInt(page, 10) + 1}&order_by=${order_by}`,
        prev: `/joyas?limits=${limit}&page=${parseInt(page, 10) - 1}&order_by=${order_by}`,
      },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// Ruta GET /joyas/filtros
router.get('/filtros', async (req, res, next) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    const filters = [];
    const values = [];

    if (precio_min) {
      filters.push(`precio >= $${filters.length + 1}`);
      values.push(precio_min);
    }

    if (precio_max) {
      filters.push(`precio <= $${filters.length + 1}`);
      values.push(precio_max);
    }

    if (categoria) {
      filters.push(`categoria = $${filters.length + 1}`);
      values.push(categoria);
    }

    if (metal) {
      filters.push(`metal = $${filters.length + 1}`);
      values.push(metal);
    }

    const query = `
      SELECT * FROM inventario
      ${filters.length ? 'WHERE ' + filters.join(' AND ') : ''}
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
