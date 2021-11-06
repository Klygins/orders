const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    isBooster: Boolean,
})

var UserModel = mongoose.model('User', userSchema)

module.exports = UserModel//