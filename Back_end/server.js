const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use PORT from .env or default to 3000

app.use(cors());
app.use(bodyParser.json());

// Database connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Get all students with pagination
app.get('/etudiants', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of items per page (default: 10)
    const offset = (page - 1) * limit; // Calculate offset

    // Query to get paginated students
    const query = 'SELECT * FROM etudiant LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Query to get the total number of students
        db.query('SELECT COUNT(*) AS total FROM etudiant', (err, countResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const totalStudents = countResult[0].total; // Total number of students
            const totalPages = Math.ceil(totalStudents / limit); // Total number of pages

            // Send the response with students and pagination data
            res.json({
                students: results,
                pagination: {
                    page,
                    limit,
                    totalStudents,
                    totalPages
                }
            });
        });
    });
});

// Add a student with validation
app.post('/etudiants', [
    body('nom').notEmpty().withMessage('Nom is required'),
    body('prenom').notEmpty().withMessage('Prenom is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('tel').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
    body('date_naissance').isDate().withMessage('Invalid date format'),
    body('filiere').notEmpty().withMessage('Filiere is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, email, tel, date_naissance, filiere } = req.body;

    // Check if email already exists
    const checkEmailQuery = 'SELECT * FROM etudiant WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert new student if email is unique
        const insertQuery = 'INSERT INTO etudiant (nom, prenom, email, tel, date_naissance, filiere) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [nom, prenom, email, tel, date_naissance, filiere], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Student added successfully', id: results.insertId });
        });
    });
});

// Update a student
app.put('/etudiants/:id', (req, res) => {
    const { nom, prenom, email, tel, date_naissance, filiere } = req.body;
    const query = 'UPDATE etudiant SET nom=?, prenom=?, email=?, tel=?, date_naissance=?, filiere=? WHERE id=?';
    db.query(query, [nom, prenom, email, tel, date_naissance, filiere, req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Student updated successfully' });
    });
});

// Delete a student
app.delete('/etudiants/:id', (req, res) => {
    const query = 'DELETE FROM etudiant WHERE id=?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

// Search students
app.get('/etudiants/search', (req, res) => {
    const query = req.query.q; 
    const searchQuery = `%${query}%`; 

    const sql = `
        SELECT * FROM etudiant
        WHERE nom LIKE ? OR prenom LIKE ? OR email LIKE ? OR tel LIKE ?
    `;
    db.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// Get all students without pagination
app.get('/etudiants/all', (req, res) => {
    const query = 'SELECT * FROM etudiant';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// Get a single student by ID
app.get('/etudiants/:id', (req, res) => {
    const query = 'SELECT * FROM etudiant WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch student' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(results[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});