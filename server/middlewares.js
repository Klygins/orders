const jwt = require('jsonwebtoken');
const OrderModel = require('./models/order.js');
const UserModel = require('./models/user.js')

const loggedIn = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user.username
        next()
    })
}
//OG = order giver
const isOrderMadeByOG = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        user = user.username
        if (err) return res.sendStatus(403)
        UserModel.findOne({ 'username': user }, (err, userdb) => {
            if (err) {
                console.log(err);
            }
            if (userdb.isBooster == true) {
                return res.sendStatus(403)
            }
            else {
                req.body.createdBy = user
                next()
            }
        })
    })
}

const isBooster = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        user = user.username
        if (err) { console.log(err); }
        UserModel.findOne({ 'username': user }, (err, userdb) => {
            if (err) {
                console.log(err);
            }
            if (userdb) {
                if (userdb.isBooster == true) {
                    req.user = user
                    next()
                }
                else {
                    return res.sendStatus(403)
                }
            } else {
                return res.sendStatus(402)
            }
        })
    })
}

const boosterHaveOrder = (req, res, next) => {
    OrderModel.find({}, (err, orders) => {
        if (err) console.log(err);
        else {
            // console.log(orders);
            let haveActiveOrder = false
            for (let index = 0; index < orders.length; index++) {
                if (orders[index].booster == req.user && orders[index].isOrderInProgress) {
                    haveActiveOrder = true
                }
            }
            console.log(haveActiveOrder);
            if (haveActiveOrder) {
                res.sendStatus(403)
            } else {
                next()
            }
        }
    })
}
module.exports = { loggedIn, isOrderMadeByOG, isBooster, boosterHaveOrder }