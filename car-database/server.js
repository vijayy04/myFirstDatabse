const express = require("express");
const app = express()
const userRouter = require('./user/users')
const userRouterForOwner = require('./user/usersForOwner')
const userRouterForCOM = require('./user/usersForCOM')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json')

 app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.use(express.json());
app.use(express.urlencoded({ extended : true }))

app.use('/carDatabase', userRouter)
app.use('/ownerDatabase', userRouterForOwner)
app.use('/comDatabase', userRouterForCOM)

app.get('/vijay', (req, res) => {
    res.send('hii this api works');
})

port = 3000;
module.exports = app.listen(port, () => console.log(`listening on port ${port}...`))