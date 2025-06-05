const express = require('express');
const router = express.Router();
const db = require('../config/db');
const slugify = require('slugify');

// Strona główna
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY featured DESC, created_at DESC');
    const [carouselItems] = await db.query('SELECT * FROM carousel ORDER BY created_at DESC LIMIT 3');

    // Dodanie sluga do każdego posta
    const postsWithSlugs = posts.map(post => ({
      ...post,
      slug: slugify(post.title, { lower: true, strict: true }) // np. "arago-na-targach-chemii-budowlanej"
    }));

    res.render('pages/home', { posts: postsWithSlugs, carouselItems });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania');
  }
});

// Pojedynczy wpis bloga ze slugiem i ID
router.get('/blog/:slugAndId', async (req, res) => {
  const slugAndId = req.params.slugAndId;
  const idMatch = slugAndId.match(/-(\d+)$/); // Szuka ID na końcu (np. "-5")

  if (!idMatch) {
    return res.status(404).send('Nieprawidłowy adres');
  }

  const postId = idMatch[1];

  try {
    // Szukamy najpierw w tabeli posts
    const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);

    if (posts.length > 0) {
      return res.render('pages/post', { post: posts[0] });
    }

    // Jeśli nie znaleziono, sprawdź tabelę carousel
    const [carousel] = await db.query('SELECT * FROM carousel WHERE id = ?', [postId]);

    if (carousel.length > 0) {
      return res.render('pages/post', { post: carousel[0] }); // używamy tego samego widoku
    }

    // Jeśli nigdzie nie znaleziono
    return res.status(404).send('Nie znaleziono wpisu');
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
    console.error(err);
    res.status(500).send('Błąd ładowania ogłoszeń');
  }
});

router.get('/o-nas', (req, res) => res.render('pages/about'));
router.get('/dystrybutorzy', (req, res) => res.render('pages/distributors'));
router.get('/kontakt', (req, res) => res.render('pages/contact'));

module.exports = router;
