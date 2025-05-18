const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));


const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/productsRoutes')

app.use('/', blogRoutes);
app.use('/admin', adminRoutes);
app.use('/produkty', productRoutes);

// Start
app.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000');
});
