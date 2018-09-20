const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrescriptionSchema = new Schema({
    label:{
        type: String,
        required: "Please input label of medicines",
    },
    route:{
        type: String,
        required: "Please input rules of medicine",
    },
    expDate:{
        type: String,
        required: "Please input expire date",
    },
    stock: Number,
    schedule: [{type: Schema.Types.ObjectId, ref: 'Schedule' }]
}, { timestamps : true })

const Prescription = mongoose.model('Prescription', PrescriptionSchema)

module.exports = Prescription

