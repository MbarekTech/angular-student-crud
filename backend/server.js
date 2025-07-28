const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'gestion_etudiants',
  connectionLimit: 10,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Database connected successfully');
  connection.release();
});

// Utility function to execute SQL queries
const query = (sql, values) =>
  new Promise((resolve, reject) => {
    pool.query(sql, values, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });

// Utility function to handle errors
const handleError = (res, err, message = 'Server Error', statusCode = 500) => {
  console.error(err);
  res.status(statusCode).json({ error: message });
};

// Get all students
app.get('/etudiants', async (req, res) => {
  try {
    const students = await query('SELECT * FROM etudiant');
    res.json(students);
  } catch (err) {
    handleError(res, err);
  }
});

// Get a single student by ID
app.get('/etudiants/:id', async (req, res) => {
  try {
    const student = await query('SELECT * FROM etudiant WHERE id = ?', [req.params.id]);
    if (student.length) {
      res.json(student[0]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    handleError(res, err);
  }
});

// Add a new student
app.post('/etudiants', async (req, res) => {
  const { nom, prenom, email, tel, date_naissance, filiere } = req.body;

  // Validate required fields
  if (!nom || !prenom || !email || !tel || !date_naissance || !filiere) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await query(
      'INSERT INTO etudiant (nom, prenom, email, tel, date_naissance, filiere) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, tel, date_naissance, filiere]
    );
    res.status(201).json({ message: 'Student added successfully', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Duplicate entry' });
    } else {
      handleError(res, err);
    }
  }
});

// Update a student by ID
app.put('/etudiants/:id', async (req, res) => {
  const { nom, prenom, email, tel, date_naissance, filiere } = req.body;

  // Validate required fields
  if (!nom || !prenom || !email || !tel || !date_naissance || !filiere) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await query(
      'UPDATE etudiant SET nom=?, prenom=?, email=?, tel=?, date_naissance=?, filiere=? WHERE id=?',
      [nom, prenom, email, tel, date_naissance, filiere, req.params.id]
    );
    if (result.affectedRows) {
      res.json({ message: 'Student updated successfully' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Duplicate entry' });
    } else {
      handleError(res, err);
    }
  }
});

// Delete a student by ID
app.delete('/etudiants/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM etudiant WHERE id=?', [req.params.id]);
    if (result.affectedRows) {
      res.json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    handleError(res, err);
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});