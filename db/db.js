var mysql = require('mysql');
// var pool = mysql.createPool({
//     host     : 'localhost',       
//     user     : 'root',              
//     password : '123456',       
//     port: '3306',                   
//     database: 'doctor',
//     connectionLimit: 9999999
// });

// var pool = mysql.createPool({
//     host: '192.168.100.46',
//     user: 'root',
//     password: 'mpc@2019',
//     port: '3306',
//     database: 'doctor',
//     connectionLimit: 9999999
// });

var pool = mysql.createPool({
    host: '39.100.122.13',
    user: 'doctor',
    password: '123456',
    port: '3306',
    database: 'doctor',
    connectionLimit: 9999999
});


function query(sql, values, callback) {
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, values, function(err, results, fields) {
            callback(err, results);
            connection.release();
            if (err) throw error;
        });
    });
}

exports.query = query;