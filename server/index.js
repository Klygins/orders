const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()

const middleware = require('./middlewares.js')
const controller = require('./controllers/index')
const ordersController = require('./controllers/orders')
// const ordersController = require('./controllers/orders')
// const accountsController = require('./controllers/accounts')

console.log('General setup...')
const db_options = { useNewUrlParser: true, useUnifiedTopology: true }
    ; (async function asyncFunction() {
        await mongoose.connect(process.env.DB_URL, db_options)
    })();

var connection = mongoose.connection;

connection.on('error', function (err) {
    console.log("Mongodb connection error:", err);
})

connection.on('open', function () {
    console.log("Successfully connected to MongoDB");
    app.emit('dbopen')
})

//-----------------------------Middlewares-----------------------------

app.use(cors())

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

console.log('Adding routes...')

//-----------------------------ROUTES-----------------------------

app.post('/login', controller.login)
app.post('/register', controller.register)
app.post('/create-order', middleware.isOrderMadeByOG, ordersController.createOrder)
app.get('/get-role', controller.getRole)
app.post('/take-order', middleware.isBooster, middleware.boosterHaveOrder, ordersController.takeOrder)
app.post('/delete-order', middleware.isOrderMadeByOG, ordersController.deleteOrder)
app.post('/update-order-data', ordersController.updateOrderData)
app.get('/login/verify', middleware.loggedIn, controller.verifyLogin)
app.get('/get-orders', middleware.isBooster, ordersController.getOrders)
app.get('/get-profile', middleware.loggedIn, controller.getProfile)
app.post('/mark-as-done', middleware.isOrderMadeByOG, ordersController.markOrderAsDone)

//-----------------------------END OF ROUTES-----------------------------

console.log('Starting server...');

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
})