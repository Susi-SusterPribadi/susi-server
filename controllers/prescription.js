const Prescription = require('../models/prescription')

const get = (req, res) => {
    res.status(200).json({msg:'connected to prescriptio'})
}

module.exports = {
    get
}