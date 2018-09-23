const Config = require('../models/config')
require('dotenv').config()

const getById = (req, res) => {
            Config
            .findOne({
                userId: req.query.userId
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
}

const create = async ({body, query}, res) => {
    try {
        let config = new Config(body)
            config.userId = query.userId
        let configOnSave = await config.save()
        res.status(200).json({info: 'successfully create setup your config', response: configOnSave})
    } catch (error) {
        res.status(400).json({info: err})
    }
}

const update = async ({body, query}, res) => {
    try{
        let config = new Config(body)
        let configUpdate = await config.updateOne( { _id: query.configId }, { $set:config})
        res.status(200).json( { info:'succesfully upadated your config', configUpdate } )
    } catch ( error ){
        res.status(400).json({message:error})
    }
}


module.exports = {
    getById,
    create,
    update
}