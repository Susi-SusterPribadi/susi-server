const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigSchema = new Schema({
    morning: String,
    afternoon: String,
    night: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps:true })

const Config = mongoose.model('Config', ConfigSchema)

module.exports = Config