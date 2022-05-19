const pgp = require('pg-promise')();
const connectionString = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '1234',
    max: 30
    }

const db = pgp(connectionString)

const query = {
fetchAll : 'select * from car;',
FetchById : `select * from car where carId = '$1'`,
updateModel : `update table car set model = '$1' where carId = $2`,
updatePrice : `update table car set price = $1 where carID = $2 `,
updateYear : `update table car set year = $1 where carID = $2 `,
updateModelPrice : `update table car set model = '$1', price = $2 where carID = $3 `,
updateModelYear : `update table car set model = '$1', year = $1 where carID = $3 `,
updatePriceYear : `update table car set price = $1, year = $2 where carID = $3 `,
updateModelPriceYear : `update table car set model = '$1', price = $2, year = $3 where carID = $4 `,
}


module.exports = db;
