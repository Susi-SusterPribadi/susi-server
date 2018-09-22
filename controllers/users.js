const User = require('../models/users')

var ValidationErrors = {
    REQUIRED: 'required',
    NOTVALID: 'notvalid',
    /* ... */
};
  
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
        birthdate: new Date(req.body.birthdate) || null,
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
        var errMessage = [];
        // go through all the errors...
        for (var errName in err.errors) {
            errMessage.push(err.errors[errName].message)
            
        }
        res
            .status(400)
            .json({
                message : errMessage
            })
    })
}




module.exports = {
    get,
    add,
}