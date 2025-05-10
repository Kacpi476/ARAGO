const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool(process.env.DB_URL);

module.exports = db;
