const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// Middleware: ogranicz 5 prób logowania na 15 minut z tego samego IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 5, // max 5 prób
  message: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// Middleware sesji
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/admin/login');
}

// Upload plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// === Logowanie ===
router.get('/login', (req, res) => {
  res.render('pages/login', { error: null });
});

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      // loguj nieudaną próbę (nie znaleziono użytkownika)
      await db.query('INSERT INTO login_attempts (username, ip_address, success) VALUES (?, ?, ?)', [username, ip, false]);
      return res.render('pages/login', { error: 'Nieprawidłowy login lub hasło' });
    }

    const match = await bcrypt.compare(password, user.password);
    const success = !!match;

    // loguj próbę (niezależnie od wyniku)
    await db.query('INSERT INTO login_attempts (username, ip_address, success) VALUES (?, ?, ?)', [username, ip, success]);

    if (!match) {
      return res.render('pages/login', { error: 'Nieprawidłowy login lub hasło' });
    }

    req.session.user = { id: user.id, username: user.username };
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd logowania');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Błąd przy wylogowaniu');
    res.redirect('/admin/login');
  });
});


// === Panel admina ===
router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/admin');
});

// === POSTY ===
router.get('/posts', isAuthenticated, async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY featured DESC, created_at DESC');
    res.render('pages/admin_posts', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd wczytywania wpisów');
  }
});

router.get('/add', isAuthenticated, (req, res) => {
  res.render('pages/add-post');
});

router.post('/addpost', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, content, featured } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  try {
    await db.query(
      'INSERT INTO posts (title, content, image, featured) VALUES (?, ?, ?, ?)',
      [title, content, image, featured ? 1 : 0]
    );
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy dodawaniu posta');
  }
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const [[post]] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).send('Nie znaleziono posta');
    res.render('pages/edit-post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania edycji');
  }
});

router.post('/edit/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, content, featured } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  try {
    if (image) {
      await db.query(
        'UPDATE posts SET title = ?, content = ?, image = ?, featured = ? WHERE id = ?',
        [title, content, image, featured ? 1 : 0, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE posts SET title = ?, content = ?, featured = ? WHERE id = ?',
        [title, content, featured ? 1 : 0, req.params.id]
      );
    }

    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy edycji posta');
  }
});

router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy usuwaniu posta');
  }
});

// === KARIERA ===
router.get('/career', isAuthenticated, async (req, res) => {
  try {
    const [offers] = await db.query('SELECT * FROM career_offers ORDER BY created_at DESC');
    res.render('pages/admin_career', { offers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania ofert');
  }
});

router.get('/career/add', isAuthenticated, (req, res) => {
  res.render('pages/add-career');
});

router.post('/career/add', isAuthenticated, async (req, res) => {
  const { title, salary, description, link } = req.body;
  try {
    await db.query(
      'INSERT INTO career_offers (title, salary, description, link) VALUES (?, ?, ?, ?)',
      [title, salary, description, link]
    );
    res.redirect('/admin/career');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy dodawaniu oferty');
  }
});

router.get('/career/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const [[offer]] = await db.query('SELECT * FROM career_offers WHERE id = ?', [req.params.id]);
    if (!offer) return res.status(404).send('Nie znaleziono oferty');
    res.render('pages/edit-career', { offer });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania edycji oferty');
  }
});

router.post('/career/edit/:id', isAuthenticated, async (req, res) => {
  const { title, salary, description, link } = req.body;
  try {
    await db.query(
      'UPDATE career_offers SET title = ?, salary = ?, description = ?, link = ? WHERE id = ?',
      [title, salary, description, link, req.params.id]
    );
    res.redirect('/admin/career');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy edycji oferty');
  }
});

router.post('/career/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM career_offers WHERE id = ?', [req.params.id]);
    res.redirect('/admin/career');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy usuwaniu oferty');
  }
});

// === CAROUSEL ===
router.get('/carousel', isAuthenticated, (req, res) => {
  res.render('pages/admin_carousel');
});

router.get('/carousel/edit/:id', isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id);
  if (![1, 2, 3].includes(id)) return res.status(403).send('Nieautoryzowany dostęp');
  try {
    const [[post]] = await db.query('SELECT * FROM carousel WHERE id = ?', [id]);
    if (!post) return res.status(404).send('Nie znaleziono posta');
    res.render('pages/carousel-edit', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania posta');
  }
});

router.post('/carousel/edit/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (![1, 2, 3].includes(id)) return res.status(403).send('Nieautoryzowany dostęp');

  const { title, category, description, content } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;
  const slug = slugify(title, { lower: true, strict: true });
  const link = `/blog/${slug}-${id}`;

  try {
    if (image) {
      await db.query(
        'UPDATE carousel SET title = ?, category = ?, description = ?, content = ?, link = ?, image = ? WHERE id = ?',
        [title, category, description, content, link, image, id]
      );
    } else {
      await db.query(
        'UPDATE carousel SET title = ?, category = ?, description = ?, content = ?, link = ? WHERE id = ?',
        [title, category, description, content, link, id]
      );
    }
    res.redirect('/admin/carousel');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy edycji posta karuzeli');
  }
});

// ======= PODGLĄD LOGÓW LOGOWANIA =======

router.get('/logs',isAuthenticated, async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT id, username, ip_address, success, created_at
      FROM login_attempts
      ORDER BY created_at DESC
      LIMIT 100
    `);

    res.render('pages/admin_logs', { logs });
  } catch (err) {
    console.error('Błąd podczas pobierania logów:', err);
    res.status(500).send('Błąd podczas pobierania logów');
  }
});


module.exports = router;
