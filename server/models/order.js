const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    createdBy: String,
    tokens: Number,
    trophyLvl: Number,
    mmrFrom: Number,
    mmrTo: Number,
    steamLogin: String,
    steamPassword: String,
    booster: String,
    payment: Number,
    paymentForBooster: Number,
    dateTaken: Date,
    dateDone: Date,
    takenBy: String,
    steamGuardCodes: [],
    isOrderInProgress: Boolean,
})

var OrderModel = mongoose.model('Order', orderSchema)

module.exports = OrderModel