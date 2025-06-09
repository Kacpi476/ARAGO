const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const dbOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

const app = express();

// Widoki EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Sesja
const sessionStore = new MySQLStore(dbOptions);
app.use(session({
    key: 'admin_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 godzina
}));

// Trasy
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/productsRoutes');

app.use('/', blogRoutes);
app.use('/admin', adminRoutes);
app.use('/produkty', productRoutes);

// Start
app.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000');
});
