const Prescription = require('../models/prescription')

const get = ( {body}, res) => {
    Prescription
    .find({
        userId: body.userId,
    })
    .then( response => {
        res.status(200).json({response})
    })
    .catch( err => {
        res.status(400).json({message:err.message})
    })
}

const add = (req, res) => {
    console.log(req.body)
    res.status(200).json(req.body)
}

module.exports = {
    get,
    add
}