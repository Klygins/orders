const UserModel = require('../models/user.js')
const OrderModel = require('../models/order.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config');
require('dotenv').config()

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
        isOrderInProgress
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
        createdBy, mmrFrom, mmrTo, tokens, trophyLvl, payment,
        steamLogin: 'n/a', steamPassword: 'n/a', booster: 'n/a', steamGuardCodes: [], isOrderInProgress: false,
    })
    newOrder.save((err) => {
        if (err) return console.log('ERROR 47', err);
        res.json('done!')
    })
    // UserModel.findOne({ username: createdBy }, (err, user) => {
    //     if (err) { console.log(err); }
    //     if (user) {
    //         user.orders.push({
    //             createdBy, mmrFrom, mmrTo, tokens, trophyLvl, payment,
    //             steamLogin: 'n/a', steamPassword: 'n/a', booster: 'n/a', steamGuardCodes: [], isOrderInProgress: false,
    //             _id: newOrder._id
    //         })
    //         user.save((err) => {
    //             if (err) console.log(err);
    //         })
    //     }
    // })
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
        return res.json(array)
    })
}

const markOrderAsDone = (req, res) => {
    const now = new Date()
    console.log(req.body);
    OrderModel.updateMany({},
        {
            $set: {
                "isOrderInProgress": false,
                "dateDone": now.toISOString()
            }
        },
        {
            arrayFilters: [
                {
                    "elem._id": req.body.orderId
                }
            ]
        }, (err, da) => {
            if (err) console.log(err);
            if (res) {
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
            }, (err, res) => { console.log(err, res); })
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
    console.log(orderId);
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
                return res.json('))))')
            }
        })
}

module.exports = { createOrder, getOrders, takeOrder, deleteOrder, updateOrderData, markOrderAsDone }