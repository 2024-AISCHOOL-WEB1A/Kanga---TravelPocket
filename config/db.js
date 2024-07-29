const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'project-db-stu3.smhrd.com',
    port: 3307,
    database: 'Insa5_JSA_hacksim_1',
    user: 'Insa5_JSA_hacksim_1',
    password: 'aischool1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = pool;
