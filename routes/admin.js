const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// === Upload zdjęć dla postów ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });


// === Panel główny (nawigacja) ===
router.get('/', (req, res) => {
  res.render('pages/admin'); // linki do /admin/posts i /admin/career
});


// ========================= POSTY ========================= //

router.get('/posts', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY featured DESC, created_at DESC;');
    res.render('pages/admin_posts', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd wczytywania wpisów');
  }
});

router.get('/add', async (req, res) => {
  res.render('pages/add-post');
});

router.post('/addpost', upload.single('image'), async (req, res) => {
  const { title, content, featured } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  try {
    await db.query(
      'INSERT INTO posts (title, content, image, featured) VALUES (?, ?, ?, ?)',
      [title, content, image, featured ? 1 : 0]
    );
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('Błąd przy dodawaniu wpisu:', err);
    res.status(500).send('Wystąpił błąd przy dodawaniu wpisu');
  }
});

router.get('/edit/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const [[post]] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).send('Nie znaleziono posta');
    res.render('pages/edit-post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania formularza edycji');
  }
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
  const postId = req.params.id;
  const { title, content, featured } = req.body;
  const newImage = req.file ? '/uploads/' + req.file.filename : null;

  try {
    if (newImage) {
      await db.query(
        'UPDATE posts SET title = ?, content = ?, image = ?, featured = ? WHERE id = ?',
        [title, content, newImage, featured ? 1 : 0, postId]
      );
    } else {
      await db.query(
        'UPDATE posts SET title = ?, content = ?, featured = ? WHERE id = ?',
        [title, content, featured ? 1 : 0, postId]
      );
    }

    res.redirect('/admin/posts');
  } catch (err) {
    console.error('Błąd przy edycji posta:', err);
    res.status(500).send('Błąd przy aktualizacji posta');
  }
});

router.post('/delete/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy usuwaniu posta');
  }
});


// ========================= KARIERA ========================= //

router.get('/career', async (req, res) => {
  try {
    const [offers] = await db.query('SELECT * FROM career_offers ORDER BY created_at DESC');
    res.render('pages/admin_career', { offers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania ofert pracy');
  }
});

// Dodawanie oferty
router.get('/career/add', (req, res) => {
  res.render('pages/add-career');
});

router.post('/career/add', async (req, res) => {
  const { title, salary, description, link } = req.body;
  try {
    await db.query(
      'INSERT INTO career_offers (title, salary, description, link) VALUES (?, ?, ?, ?)',
      [title, salary, description, link]
    );
    res.redirect('/admin/career');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy dodawaniu oferty pracy');
}
});

// Edycja oferty
router.get('/career/edit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [[offer]] = await db.query('SELECT * FROM career_offers WHERE id = ?', [id]);
    if (!offer) return res.status(404).send('Nie znaleziono oferty');
    res.render('pages/edit-career', { offer });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania edycji oferty');
  }
});


router.post('/career/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { title, salary, description, link } = req.body;
  try {
    await db.query(
      'UPDATE career_offers SET title = ?, salary = ?, description = ?, link = ? WHERE id = ?',
      [title, salary, description, link, id]
    );
    res.redirect('/admin/career');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy edycji oferty');
  }
});


// Usuwanie oferty
router.post('/career/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM career_offers WHERE id = ?', [id]);
    res.redirect('/admin/career');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy usuwaniu oferty');
  }
});

// ================= CAROUSEL ================= //

router.get('/carousel', (req, res) => {
  res.render('pages/admin_carousel');
});

router.get('/carousel/edit/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  if (![1, 2, 3].includes(postId)) return res.status(403).send('Nieautoryzowany dostęp');

  try {
    const [[post]] = await db.query('SELECT * FROM carousel WHERE id = ?', [postId]);
    if (!post) return res.status(404).send('Nie znaleziono posta');
    res.render('pages/carousel-edit', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd ładowania formularza');
  }
});

router.post('/carousel/edit/:id', upload.single('image'), async (req, res) => {
  const postId = parseInt(req.params.id);
  if (![1, 2, 3].includes(postId)) return res.status(403).send('Nieautoryzowany dostęp');

  const { title, category, description, content, link } = req.body;
  const newImage = req.file ? '/uploads/' + req.file.filename : null;

  try {
    if (newImage) {
      await db.query(
        'UPDATE carousel SET title = ?, category = ?, description = ?, content = ?, link = ?, image = ? WHERE id = ?',
        [title, category, description, content, link, newImage, postId]
      );
    } else {
      await db.query(
        'UPDATE carousel SET title = ?, category = ?, description = ?, content = ?, link = ? WHERE id = ?',
        [title, category, description, content, link, postId]
      );
    }

    res.redirect('/admin/carousel');
  } catch (err) {
    console.error('Błąd przy edycji posta karuzeli:', err);
    res.status(500).send('Błąd aktualizacji posta');
  }
});




module.exports = router;
