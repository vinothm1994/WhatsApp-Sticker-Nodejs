const mysql = require('mysql');
var ENV_DEV="development";
var env = process.env.NODE_ENV || ENV_DEV;
console.log("mode:"+env);
if (env === ENV_DEV) {
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



