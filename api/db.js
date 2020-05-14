'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || "us-cdbr-east-06.cleardb.net",
    //port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "b406b4c927e28e",
    password: process.env.DB_PASSWORD || "eaf6ae71",
    database: process.env.DB_NAME || "heroku_e57f098503ff54d"
});
module.exports = db