const express = require("express");
const app = express()
const userRouter = require('../routes/user')
app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use('/student', userRouter)
app.get('/v', (req, res) => {
    console.log('hiiiiiiiiiiiiiiiiiiiihhhhhhhhhhhhhhhiiiiiiiiiiiiiihhhhhhhhhiiiiihhhhhhhiiiiihhhhhhhhhiiiihihihhhhhhhh');  
    res.send('hiihihih');
})



app.listen(3000)