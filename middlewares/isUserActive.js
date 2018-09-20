const User = require('../models/users')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const isUserActive = function (req, res, next) {
    
    jwt.verify(req.headers.authorization, process.env.tokenSecretKey
        ,   function ( err, decoded ) {
                if (err) res.status(400).json({msg:"invalid token"})
                User
                .find({
                    id : decoded.id,
                    email : decoded.email,
                })
                .then(response => {
                    console.log('decoded result : ', response)
                    next()
                })
                .catch(err => {
                    res.status(res.status(401).json({msg:"don't have a credential"}))
                })


        })
}   

module.exports = isUserActive