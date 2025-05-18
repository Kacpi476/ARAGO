const express = require('express');
const router = express.Router();
const db = require('../config/db');
const path = require('path');


router.get('/', (req, res) => {
    res.render('pages/products');
});

router.get('/arago', (req, res) => {
    res.render('pages/product-arago');
});

router.get('/clarb', (req, res) => {
    res.render('pages/product-clarb');
});

module.exports = router;
