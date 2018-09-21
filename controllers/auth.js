const User = require('../models/users')
var jwt = require('jsonwebtoken');
require('dotenv').config()

const login = function(req,res){
    let email = req.body.email
    let password = req.body.password
    
    User
    .findOne({
        email : email
    })
    .then(function(user){
        if(user){         
            user
            .comparePassword(password, function(err, isMatch){  
                if(isMatch){
                    var token = jwt.sign({ id:user._id, name:user.name, email:user.email }, process.env.tokenSecretKey);
                    res
                        .status(200)
                        .json({
                            message : "login successfully",
                            authorization : token,
                            id: user._id,
                            email: user.email,
                            name: user.name
                        })
                } else {
                    res
                        .status(401)
                        .json({
                            msg : "wrong password"
                        })
                }

            })
        }else{
            res
                .status(400)
                .json({msg : "email unregister"})
        }
    })
    .catch(function(err){
        res
        .status(401)
        .json({
            msg : err.message
        })
    })
}

module.exports = {
    login
}