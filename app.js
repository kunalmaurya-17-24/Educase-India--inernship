require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Promisify for Node.js async/await.
const promisePool = pool.promise();

// Middleware to parse JSON
app.use(express.json());

// Route example: Get all schools
app.get('/schools', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM schools');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route example: Add a new school
app.post('/schools', async (req, res) => {
    const { name, latitude, longitude, address } = req.body;
    try {
        const [result] = await promisePool.query(
            'INSERT INTO schools (name, latitude, longitude, address) VALUES (?, ?, ?, ?)',
            [name, latitude, longitude, address]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route example: Get schools within a certain distance
app.get('/schools/nearby', async (req, res) => {
    const { latitude, longitude, distance } = req.query;

    try {
        const query = `
            SELECT *, 
                ( 3959 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) AS distance
            FROM schools
            HAVING distance < ?
            ORDER BY distance
        `;

        const [rows] = await promisePool.query(query, [latitude, longitude, latitude, distance]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching nearby schools:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
