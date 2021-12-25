const UserModel = require('../models/user.js')
const OrderModel = require('../models/order.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config');
require('dotenv').config()
const utils = require('../utils')

const sendDataToOG = (req, res) => {
    const setParams = {
        $set: {
            boosterLoggedIn: req.body.boosterLoggedIn,
            nowMmr: req.body.nowMmr
        }
    }

    OrderModel.updateOne({ _id: req.body.orderId }, setParams,
        (err) => {
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
        createdBy, mmrFrom, mmrTo, tokens, trophyLvl, nowMmr,
        steamLogin, steamPassword, booster, payment, dateTaken,
        dateDone, steamGuardCodes, isOrderInProgress, boosterLoggedIn
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
        if (err) return console.log('ERROR in createOrder:', err);
        utils.sendMessage().catch(
            error => console.log('error in sendMessage:', error)
        )
        res.json('done!')
    })
}

const getOrders = (req, res) => {

    OrderModel.find({}, (err, activeOrders) => {
        const array = []
        if (err) throw err

        activeOrders.forEach((order) => {
            if (!order.isOrderInProgress && !order.dateDone) {
                order.payment = order.payment * config.percent
                array.push(order)
            }
        })

        return res.json(array)
    })
}

const markOrderAsDone = (req, res) => {
    const now = new Date()
    const setParams = {
        $set: {
            "isOrderInProgress": false,
            "dateDone": now.toISOString()
        }
    }

    OrderModel.updateOne({ _id: req.body.orderId }, setParams,
        (err, result) => {
            if (err) throw err
            if (result) {
                console.log(`Order ${req.body.orderId} marked as done`)
                return res.sendStatus(200)
            }
        })
}

const updateOrderData = (req, res) => {
    const { steamLogin, steamPassword, steamGuardCodes } = req.body
    const setParams = {
        $set: {
            steamLogin, steamPassword,
            "steamGuardCodes": steamGuardCodes == 'none' ? [] : steamGuardCodes
        }
    }

    OrderModel.updateOne({ _id: req.body._id }, setParams,
        (err, res) => {
            if (err) throw err
            else {
                console.log(`New data for order ${req.body._id}:`, req.body)
            }
        })
    res.sendStatus(200)
}

const deleteOrder = (req, res) => {
    const { orderId, createdBy } = req.body

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
    const setParams = {
        $set: {
            "booster": booster,
            "dateTaken": (new Date()).toISOString(),
            "isOrderInProgress": true
        }
    }
    OrderModel.updateOne({ _id: orderId }, setParams,
        (err) => {
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