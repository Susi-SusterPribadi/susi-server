const Config = require('../models/config')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getById = (req, res) => {
    jwt.verify(req.headers.authorization, process.env.tokenSecretKey 
        , function(err, decoded) {
            if (err) res.status(400).json({msg:"invalid token"})

            Config
            .findOne({
                userId: decoded.id
            })
            .then( response => {
                if(response){
                    res.status(200).json({response})
                } else {
                    res.status(400).json({info:'you must setup your times configuration'})
                }
            })
            .catch( err => {
                res.status(400).json({info:err})
            })
        })
}

const create = (req, res) => {
    jwt.verify(req.headers.authorization, process.env.tokenSecretKey
        , (err, decoded) => {
            if(err) res.status(400).json({msg:"invalid token"})

            Config
            .create({
                morning: req.body.morning,
                afternoon: req.body.afternoon,
                night: req.body.night,
                userId: decoded.id
            })
            .then( response => {
                res.status(200).json({info: 'successfully create setup your config', response: response})
            })
            .catch( err => {
                res.status(400).json({info: err})
            })
        })
}

module.exports = {
    getById,
    create
}