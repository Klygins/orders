const UserModel = require('../models/user.js')
const OrderModel = require('../models/order.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
require('dotenv').config()

const getRole = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        user = user.username
        UserModel.findOne({ 'username': user }, (err, userdb) => {
            if (err) {
                console.log(err);
                return res.sendStatus(401)
            }
            if (userdb)
                return res.json(userdb.isBooster ? 1 : 2)
            else
                return res.sendStatus(404)
        })
    })
}

const verifyLogin = (req, res) => {
    if (req.user)
        res.sendStatus(200)
    else
        res.sendStatus(403)
}

const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = { username }
    const expiresIn = '60d'

    UserModel.findOne({ username }, (err, userdb) => {
        if (err) throw err;
        if (!userdb) return res.sendStatus(401);

        const hashedPassword = bcrypt.hashSync(password, 7);
        console.log('Trying to login user ' + username + ' with password ' + hashedPassword);
        bcrypt.compare(password, userdb.password, (err, bcrypt_result) => {
            if (err) throw err;
            if (bcrypt_result == true) {
                const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn })
                res.json({ token })
            } else {
                return res.sendStatus(401);
            }
        })
    })
}

const register = (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const permittedIps = ['127.0.0.1']
    var isPermitted = false
    permittedIps.forEach((permitIp) => {
        if (ip.includes(permittedIps))
            isPermitted = true
        else 
            console.log('ip not permitted:', ip)
    })

    if (!isPermitted)
        return res.sendStatus(404)

    const username = req.body.username
    const password = req.body.password
    const isBooster = req.body.isBooster
    const expiresIn = '60d'
    console.log('req body register', req.body);

    UserModel.findOne({ username: username }, (err, user) => {
        if (err) throw err
        if (user) {
            return res.status(401).json({ message: "Пользователь с таким именем уже существует" })
        } else {
            const hashedPassword = bcrypt.hashSync(password, 7);
            const newUser = new UserModel({ username: username, password: hashedPassword, isBooster: isBooster, orders: [] })
            console.log('newUsr', newUser);
            newUser.save((err) => {
                if (err) return console.log('ERROR 47', err);
                // saved!
                const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn })
                return res.json({ token })
            });
        }
    })
}

const getProfile = (req, res) => {
    reqUsername = req.user
    const boosterCase = () => {
        const ordersToReturn = []
        OrderModel.find({ booster: reqUsername }, (err, orders) => {
            if (err) console.log(err);
            for (let index = 0; index < orders.length; index++) {
                orders[index].payment = orders[index].payment * config.percent
                ordersToReturn.push(orders[index])
            }
            res.json(ordersToReturn)
        })
    }

    const ogCase = () => {
        const ordersToReturn = []
        OrderModel.find({ createdBy: reqUsername }, (err, orders) => {
            if (err) console.log(err);
            for (let index = 0; index < orders.length; index++) {
                ordersToReturn.push(orders[index])
            }
            res.json(ordersToReturn)
        })
    }

    UserModel.findOne({ username: reqUsername }, (err, user) => {
        if (err) console.log(err);
        else {
            if (user.isBooster) {
                boosterCase()
            } else {
                ogCase()
            }
        }
    })

}

module.exports = { login, register, verifyLogin, getProfile, getRole }