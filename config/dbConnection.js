const mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
console.log("mode:"+env);
if (env === "development") {
    module.exports = function () {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sticker'
        });
    };
} else {
    module.exports = function () {
        return mysql.createConnection({
            host: 'remotemysql.com',
            user: '29Jlzge8OP',
            password: 'vSMXTg3BAq',
            database: '29Jlzge8OP'
        });
    };
}



