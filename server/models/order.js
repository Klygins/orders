const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    createdBy: String,
    tokens: String,
    trophyLvl: String,
    mmrFrom: Number,
    mmrTo: Number,
    steamLogin: String,
    steamPassword: String,
    booster: String,
    payment: Number,
    paymentForBooster: Number,
    dateTaken: Date,
    dateDone: Date,
    steamGuardCodes: [],
    isOrderInProgress: Boolean,
    boosterLoggedIn: Boolean,
    nowMmr: Number
})

var OrderModel = mongoose.model('Order', orderSchema)

module.exports = OrderModel