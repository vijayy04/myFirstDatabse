const express = require("express");
const app = express()
const userRouter = require('./user/users')
app.use(express.json());
app.use(express.urlencoded({ extended : true }))

app.use('/carDatabase', userRouter)

app.get('/vijay', (req, res) => {
    res.send('hii this api works');
})
app.listen(3000);