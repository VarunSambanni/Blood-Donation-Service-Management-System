const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: 'mysqlisnice'
});

console.log("Database Connection Successful ");
module.exports = pool.promise();