"use strict";

const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken')
const jwtKey = 'secretToken'
const userSchema = require('../models/User');

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