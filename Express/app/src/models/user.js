const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // erase space
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 권한
        type: Number, // 0 = user, 1 = admin
        default: 0
    },
    image: String,
    token: { // use for validation
        type: String
    },
    tokenExp: { // token expiration time
        type: Number
    }
})

const User = mongoose.model('User', userSchema) // make model from schema

module.exports = {
    User,
}