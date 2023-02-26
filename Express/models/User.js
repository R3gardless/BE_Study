const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken')
const jwtKey = 'secretToken'

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

userSchema.pre('save',function(next) { // method which doing before user.save, () => can't use this or super

    const user = this;

    if(user.isModified('password')) { // doesn't have to hash password skip this method
        // Hash Password
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err); // return error to user.save
            bcrypt.hash(user.password, salt, function(err, hash){ // hash = crypted password
                if(err) return next(err) // return error to user.save
                user.password = hash
                next() // Do user.save
            });
        });
    } else { // not modified
        next()
    }

}) 

userSchema.methods.comparePassword = function(plainPassword, callback) {

    // plainPassword
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return callback(err)
        return callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function(callback) {
    
    const user = this;
    //using jsonwebtoken makes token

    const token = jwt.sign(user._id.toHexString(), jwtKey)

    user.token = token
    user.save(function(err, user){
        if(err) return callback(err)
        return callback(null, user)
    })
}

userSchema.statics.findByToken = function ( token, callback ) { // static function 
    const user = this;
    // decode token
    jwt.verify(token, jwtKey, function(err, decoded) {

        // find user by user id (decoded)
        // check client cookie's token === db token
        user.findOne({"_id": decoded, "token": token }, function (err, user) {
            
            if(err) return callback(err);
            return callback(null, user);
        
        })
    })
}
const User = mongoose.model('User', userSchema) // make model from schema

module.exports = {
    User, 
}