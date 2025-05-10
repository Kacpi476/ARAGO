const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Strona główna
router.get('/', (req, res) => {
    res.render('pages/home');
});

router.get('/blog', async (req, res) => {
    try {
      const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.render('pages/blog', { posts });
    } catch (err) {
        res.status(500).send('Błąd ładowania bloga');
    }
});

// Test połączenia z bazą
router.get('/test-db', async (req, res) => {
try {
    const [rows] = await db.query('SELECT NOW() AS teraz');
    res.send(`✅ Połączono z MySQL! Aktualny czas: ${rows[0].teraz}`);
} catch (err) {
    console.error('❌ Błąd połączenia:', err);
    res.status(500).send('Błąd połączenia z bazą danych');
}
});



// Pojedynczy wpis bloga
router.get('/blog/:id', async (req, res) => {
const postId = req.params.id;

    try {
      const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    if (rows.length === 0) {
        return res.status(404).send('Nie znaleziono wpisu');
    }
const post = rows[0];
res.render('pages/post', { post });
} catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania wpisu');
}
});

module.exports = router;
