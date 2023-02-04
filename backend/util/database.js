const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'blooddonationservicemanagementsystem',
    password: 'mysqlisnice'
});

console.log("Connection successful");
module.exports = pool.promise();