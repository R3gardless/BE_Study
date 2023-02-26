"use strict";

const express = require("express");
const { auth } = require("../middlware/auth");
const ctrl = require("./user.controller");
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
})
router.post('/api/users/register', ctrl.register);
router.post('/api/users/login', ctrl.login);
// Middleware = endpoint 와 callback function 사이에 하는 작업
router.get('/api/users/auth', auth, (req, res) => {
    // Pass Middleware → authentication = true
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})
router.get('/api/users/logout', auth, ctrl.logout);

module.exports = router;