const { User } = require("../models/User")

const auth = (req, res, next) => {
    
    // process authentication

    // 1. Get Token from Client Cookie
    const token = req.cookies.x_auth;
    // 2. Token decrypt and find user
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })
        req.token = token;
        req.user = user;
        next(); // This is Middleware so move to next step
    })

    // 3. Check Authentication that user
}

module.exports = { auth };