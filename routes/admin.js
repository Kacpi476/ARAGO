const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// upload zdjec
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



// panel glowny
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.render('pages/admin', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd wczytywania wpisów');
  }
});

// Formularz dodawania nowego wpisu
router.get('/add', (req, res) => {
  res.render('pages/add-post');
});

// Obsługa dodawania wpisu (POST z obrazkiem)
router.post('/addpost', upload.single('image'), async (req, res) => {
const { title, content } = req.body;
const image = req.file ? '/uploads/' + req.file.filename : null;

try {
    await db.query(
        'INSERT INTO posts (title, content, image) VALUES (?, ?, ?)',
        [title, content, image]
    );
    res.redirect('/admin');
} catch (err) {
    console.error('Błąd przy dodawaniu wpisu:', err);
    res.status(500).send('Wystąpił błąd przy dodawaniu wpisu');
}
});

// Formularz edycji
router.get('/edit/:id', async (req, res) => {
    const postId = req.params.id;
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);

if (!rows.length) return res.status(404).send('Nie znaleziono posta');
res.render('pages/edit-post', { post: rows[0] });
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
  const postId = req.params.id;

  // DEBUG
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const { title, content } = req.body;
  const newImage = req.file ? '/uploads/' + req.file.filename : null;

  try {
    if (newImage) {
      await db.query(
        'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?',
        [title, content, newImage, postId]
      );
    } else {
      await db.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, postId]
      );
    }

    res.redirect('/admin');
  } catch (err) {
    console.error('Błąd przy edycji posta:', err);
    res.status(500).send('Błąd przy aktualizacji posta');
  }
});


// Obsługa usuwania wpisu
router.post('/delete/:id', async (req, res) => {
const postId = req.params.id;
try {
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);
    res.redirect('/admin');
} catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy usuwaniu posta');
}
});

module.exports = router;
