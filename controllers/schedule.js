const Prescription = require('../models/prescription')

const get = (req, res, next) => {
    let userId = '5ba34bb4c70a9640927e9caa'
    let times = 3
    let startDate = new Date()
    let config = {
        morning : 6,
        afternoon : 12,
        night : 18,
        customize : 2
    }

    let prescription = {
        label: 'dexamethazone',
        route: 'oral',
        expDate: new Date(),
        stock: 5,
        schedule : []
    }

    for( let i = 0 ; i < times ; i++){
        console.log(i, startDate)
    }
    res.status(200).json({info:'you got the access', prescription:prescription})
}

module.exports = {
    get
}