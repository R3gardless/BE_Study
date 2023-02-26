"use strict";

const { User } = require('../models/User');


const register = (req, res) => {
    // data use for register
    const user = new User(req.body) // make instance

    user.save((err, user) => {  // mongoDB method, userInfo return
        if(err) return res.json({ success : false, err })
        return res.status(200).json({
            success: true
        })
    })
}

const login = (req, res) => {
    // find is request email
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) { // any user has same email
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        } 
        // check is password same (plaintext → hash)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다 "})

            // if all same make token for authentication
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err); // status 400 send error message

                // save token cookie, local-storage, session-storage etc → save token at cookie
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
}

const logout = (req, res) => {
    // Auth middlware return req.user
    User.findOneAndUpdate({ _id: req.user._id }, { token : "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
}

module.exports = {
    register,
    login,
    logout,
}