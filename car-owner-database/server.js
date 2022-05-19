const express = require("express");
const app = express()
const { Client } = require('pg')
const userRouter = require('./user/users')
const db = require('./db')
app.use(express.json());
app.use(express.urlencoded({ extended : true }))

app.use('/carOwnerDatabase', userRouter)

app.get('/vijay', (req, res) => {
    res.send('hii this api works');
})

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    databse: 'postgres',
    password: '1234',
    port: '5432'
})
client.connect();
// client.query(`select * from carOwner; ` , (err, result) => {
//     console.log(err, result)
//     client.end()
//   })

app.listen(3000);