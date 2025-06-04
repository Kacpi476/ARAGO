const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Strona główna
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY featured DESC, created_at DESC');
    const [carouselItems] = await db.query('SELECT * FROM carousel ORDER BY created_at DESC LIMIT 3');
    const carouselJSON = JSON.stringify(carouselItems);
    res.render('pages/home', { posts, carouselItems });
  } catch (err) {
    res.status(500).send('Błąd ładowania');
  }
});

// Pojedynczy wpis bloga
router.get('/blog/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    if (rows.length === 0) return res.status(404).send('Nie znaleziono wpisu');
    res.render('pages/post', { post: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania wpisu');
  }
});

// Strona kariera
router.get('/kariera', async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM career_offers ORDER BY created_at DESC');
    res.render('pages/career', { jobs });
  } catch (err) {
    res.status(500).send('Błąd ładowania ogłoszeń');
  }
});



router.get('/o-nas', (req, res) => res.render('pages/about'));
router.get('/dystrybutorzy', (req, res) => res.render('pages/distributors'));
router.get('/kontakt', (req, res) => res.render('pages/contact'));

module.exports = router;
