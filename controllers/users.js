const User = require('../models/users')

const get = function(req, res){
    User
    .find()
    .then(function(user){
        res
        .status(200)
        .json({
            user : user 
        })
    })
    .catch(function(err){
        res
            .status(400)
            .json({
                msg : err.message
            })
    })
}

const add = function(req,res){
    User
    .create({
        name: req.body.name,
        birthdate: new Date(req.body.birthdate),
        email: req.body.email,
        password : req.body.password,
    })
    .then(function(user){
        res
            .status(200)
            .json({
                msg : "successfully create user",
                user : user 
            })
    })
    .catch(function(err){
        res
            .status(400)
            .json({
                msg : err.message
            })
    })
}




module.exports = {
    get,
    add,
}