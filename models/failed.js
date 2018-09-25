const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FailedSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
    prescriptionId: {type: Schema.Types.ObjectId, ref: 'Prescription' },
    time: Date,
    isDrunk: Boolean,
    onSchedule: String
}, { timestamps:true})

const Failed = mongoose.model('Failed', FailedSchema)

module.exports = Failed