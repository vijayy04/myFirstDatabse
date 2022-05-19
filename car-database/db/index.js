const Pool = require('pg').Pool
const t = "test";
let pool; 
if(t === "test"){
     pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: ' car_test',
        password: '1234',
        port: '5432'
    })
}
else{
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '1234',
        port: '5432'
    });
}

pool.connect();
module.exports = pool;