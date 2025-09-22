// A simple Express server to act as the API for the Enclosure Management App.
// Dependencies: express, pg (node-postgres), cors
// Run `npm install express pg cors`

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = 3001;
const saltRounds = 10;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- PostgreSQL Database Connection ---
// This configuration connects to the PostgreSQL container defined in docker-compose.yml
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'enclosure_management',
  password: 'password',
  port: 5432,
});

// --- API Endpoints (Routes) ---

// GET /api/groups - Fetch all enclosure groups
app.get('/api/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT *, enclosure_count as "enclosureCount" FROM groups ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching groups.' });
  }
});

// POST /api/groups - Create a new enclosure group
app.post('/api/groups', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Group name is required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO groups (name, description, enclosure_count) VALUES ($1, $2, $3) RETURNING *, enclosure_count as "enclosureCount"',
      [name, description || '', 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the group.' });
  }
});

// DELETE /api/groups/:id - Delete an enclosure group
app.delete('/api/groups/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM groups WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Group not found.' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the group.' });
  }
});


// --- API Endpoints for Enclosures
// GET /api/enclosures - Fetch all enclosures (excluding password hash)
app.get('/api/enclosures', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, ip_address, username, created_at FROM enclosures ORDER BY name ASC');
        const enclosures = result.rows.map(enc => ({...enc, ipAddress: enc.ipAddress}));
        res.json(enclosures);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'An error occurred while fetching enclosures'})
    }
});

// POST /api/enclosures - Add a new enclosure
app.post('/api/enclosures', async (req, res) => {
    const {name, ipAddress, username, password} = req.body;
    if (!name || !ipAddress || !username || !password) {
        return res.status(400).json({error: 'Name, IP Address, Username and Password are required.'});
    }
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            'INSERT INTO enclosures (name, ip_address, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, ip_address, username, created_at',
            [name, ipAddress, username, passwordHash]
        );
        const newEnclosure = {...result.rows[0], ipAddress: result.rows[0].ip_address};
        res.status(201).json(newEnclosure);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({error: 'An enclosure with this IP Address already exists.'});
        }
        res.status(500).json({error: 'An error occurred while adding the enclosure.'});
    }
});

// PUT /api/enclosures/:id - Update and enclosure
app.put('/api/enclosures/:id', async (req, res) => {
    const { id } = req.params;
    const { name, ipAddress, username, password } = req.body;
    if (!name || !ipAddress || !username) {
        return res.status(400).json({error: 'Name, IP Address and username are required.'});
    }
    try {
        let result;
        if (password) {
            const passwordHash = await bcrypt.hash(password, saltRounds);
            result = await pool.query(
                'UPDATE enclosures SET name = $1, ip_address = $2, username = $3, password = $4 WHERE id = $5 RETURNING id, name, ip_address, username',
                [name, ipAddress, username, passwordHash, id]
            );
        } else {
            result = await pool.query(
                'UPDATE enclosures SET name = $1, ip_address = $2, username = $3 WHERE id = $4 RETURNING id, name, ip_address, username',
                [name, ipAddress, username, id]
            );
        }

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Enclosure not found.'});
        }
        const updatedEnclosure = {...result.rows[0], ipAddress: result.rows[0].ip_address};
        res.json(updatedEnclosure);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({error: 'An enclosure with this IP Address already exists.'});
        }
        res.status(500).json({error: 'An error occurred while updating the enclosure details.'});
    }
});

// DELETE /api/enclosures/:id - Delete an Enclosure
app.delete('/api/enclosures/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('DELETE FROM enclosures WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Encosure not found.'});
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({error:'An error occurred while deleting the enclosure.'});
    }
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Enclosure Management API server listening on http://localhost:${port}`);
});
