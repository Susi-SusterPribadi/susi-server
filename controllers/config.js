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
        res.status(200).json({info: 'successfully create setup your config', body: configOnSave})
    } catch (error) {
        res.status(400).json({info: error})
    }
}

const update = async ({body, query}, res) => {
    try{
        let config = await Config.findOneAndUpdate({userId: query.userId}, { $set:body} )
        let newConfig = await Config.findOne(config._id)
        console.log(query, body, newConfig)
        res.status(200).json( { info:'succesfully upadated your config', body: newConfig } )
    } catch ( error ){
        res.status(400).json({message:error})
    }
}

const posting = async ({body, query}, res ) => {
    try{
        let configOnSearch = await Config.findOne({userId: query.userId})
        
        configOnSearch ? update({body, query}, res ) : create({body, query}, res ) ;

    }catch (error) {
        res.status(400).json({message:error})
    }
}

module.exports = {
    getById,
    create,
    update,
    posting
}