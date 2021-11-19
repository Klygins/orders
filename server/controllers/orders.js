const UserModel = require('../models/user.js')
const OrderModel = require('../models/order.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config');
require('dotenv').config()
const axios = require('axios')

const sendDataToOG = (req, res) => {
    OrderModel.updateOne({ _id: req.body.orderId },
        {
            $set: {
                boosterLoggedIn: req.body.boosterLoggedIn,
                nowMmr: req.body.nowMmr
            }
        }, (err, da) => {
            if (err !== null || err) {
                console.log(err); res.sendStatus(400)
            }
            else {
                if (res) {
                    console.log(`Booster ${req.user} send to og data:`, req.body)
                    return res.sendStatus(200)
                }
            }
        })
}

const createOrder = (req, res) => {
    const arr = []
    const {
        createdBy,
        mmrFrom,
        mmrTo,
        tokens,
        trophyLvl,
        steamLogin,
        steamPassword,
        booster,
        payment,
        dateTaken,
        dateDone,
        steamGuardCodes,
        isOrderInProgress,
        boosterLoggedIn,
        nowMmr
    } = req.body

    if (mmrFrom >= mmrTo) {
        res.statusMessage = 'MMR From >= MMR To'
        return res.status(400).end();
    }

    arr.push(mmrFrom, mmrTo, tokens, trophyLvl, payment)
    console.log('New order data: ', req.body)
    for (let index = 0; index < arr.length; index++)
        if (arr[index] == null || arr[index] == '')
            return res.status(401).json('err')

    const newOrder = new OrderModel({
        createdBy, mmrFrom, mmrTo, tokens, trophyLvl, payment, boosterLoggedIn: false, mmrNow: '',
        steamLogin: 'n/a', steamPassword: 'n/a', booster: 'n/a', steamGuardCodes: [], isOrderInProgress: false,
    })
    newOrder.save((err) => {
        if (err) return console.log('ERROR 47', err);
        const botMessage =
            `New order: ${newOrder.mmrFrom}-${newOrder.mmrTo} ` +
            `tokens:${newOrder.tokens} trophy lvl: ${newOrder.trophyLvl} payment: ${newOrder.payment * config.percent} @everyone \n
if u wanna take order go to https://dota-orders.ngrok.io/#/orders`
        const discordJson = {
            "content": botMessage,
            "tts": "false"
        }
        axios({
            method: "POST",
            data: discordJson,
            headers: config.discordHeaders,
            url: config.discordUrl
        })
        res.json('done!')
    })
}

const getOrders = (req, res) => {

    OrderModel.find({}, (err, activeOrders) => {
        const array = []
        if (err) console.log(err)
        for (let index = 0; index < activeOrders.length; index++) {
            if (!activeOrders[index].isOrderInProgress && !activeOrders[index].dateDone) {
                activeOrders[index].payment = activeOrders[index].payment * config.percent
                array.push(activeOrders[index])
            }
        }
        // console.log(`boooster ${req.user} is online`);
        return res.json(array)
    })
}

const markOrderAsDone = (req, res) => {
    const now = new Date()
    OrderModel.updateOne({ _id: req.body.orderId },
        {
            $set: {
                "isOrderInProgress": false,
                "dateDone": now.toISOString()
            }
        }, (err, da) => {
            if (err) console.log(err);
            if (res) {
                console.log(`Order ${req.body.orderId} marked as done`)
                return res.sendStatus(200)
            }
        })
}

const updateOrderData = (req, res) => {
    if (req.body.steamLogin != '' && req.body.steamPassword != '' && req.body.steamGuardCodes != '') {
        OrderModel.updateOne({ _id: req.body._id },
            {
                $set: {
                    "steamLogin": req.body.steamLogin,
                    "steamPassword": req.body.steamPassword,
                    "steamGuardCodes": req.body.steamGuardCodes
                }
            }, (err, res) => {
                if (err) console.log(err)
                else {
                    console.log(`New data for order ${req.body._id}:`, req.body)
                }
            })
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
}

const deleteOrder = (req, res) => {
    const orderId = req.body.orderId
    const createdBy = req.body.createdBy

    OrderModel.findOne({ "_id": orderId }, (err, order) => {
        if (err) console.log(err);
        if (order) {
            OrderModel.remove({ _id: orderId }, function (err) {
                if (!err) {
                    console.log(`order ${order.mmrFrom}-${order.mmrTo} created by ${createdBy} deleted`)
                    res.json('deleted succesfully')
                }
                else {
                    res.json('err')
                }
            })
        }
    })
}

const takeOrder = (req, res) => {
    const booster = req.user
    const orderId = req.body.orderId
    const now = new Date()
    OrderModel.updateOne({ _id: orderId },
        {
            $set: {
                "booster": booster,
                "dateTaken": now.toISOString(),
                "isOrderInProgress": true
            }
        }, (err, mod) => {
            if (err) console.log(err);
            else {
                console.log(`booster ${booster} takes order ${orderId}`);
                return res.json('))))')
            }
        })
}

module.exports = {
    createOrder, getOrders, takeOrder, deleteOrder, updateOrderData, markOrderAsDone,
    sendDataToOG
}