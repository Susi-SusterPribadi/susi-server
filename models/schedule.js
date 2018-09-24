const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScheduleSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
    prescriptionId: {type: Schema.Types.ObjectId, ref: 'Prescription' },
    time: Date,
    isDrunk: Boolean
}, { timestamps:true})

const Schedule = mongoose.model('Schedule', ScheduleSchema)

module.exports = Schedule