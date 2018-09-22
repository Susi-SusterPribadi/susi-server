const Prescription = require('../models/prescription')
const Config  = require('../models/config')
const Schedule = require('../models/schedule')



const generateSchedule = async (prescription) => {
    let arrSchedule = []
    //userId, prescriptonId, time
    //new Date(2011, 0, 1, 0, 0, 0, 0); // // 1 Jan 2011, 00:00:00
    let startDatePrescription = new Date(prescription.createdAt)
    let stock = prescription.stock
    let times = prescription.times
    
    //function get config, parameter : config, times, stock, return array of scheduleOfDay        
    let interval = 24 / times
    while(stock > 0 ){
        for(let i = 0; i < times; i++){
            let scheduleGetTime = startDatePrescription
            // console.log(prescription._id, ', on :', scheduleGetTime)
            let schedule = new Schedule({userId:prescription.userId, prescriptionId:prescription._id, time:scheduleGetTime})
            let scheduleSave = await schedule.save()
            arrSchedule.push(scheduleSave._id)
            startDatePrescription.setHours(startDatePrescription.getHours() + interval)
        }
        stock -= times
    }

    
    // console.log(schedule)
    // tomorrow.setDate(tomorrow.getDate() + 1);
    return arrSchedule
}


const get = ( req, res) => {
    
    Prescription
    .find({
        userId: req.query.userId
    })
    .then( response => {
        res.status(200).json({response})
    })
    .catch( err => {
        res.status(400).json({message:err})
    })
}

const add = async ( { body } , res) => {
    console.log( new Date() < new Date(body.expDate))
    if( new Date() < new Date(body.expDate)){
        try{

            console.log("presription /post request: ",body)
            let prescription =  new Prescription(body)
            let config = await Config.findOne({userId:body.userId})
            let prescriptionOnSave =  await prescription.save( )

            let schedule = await generateSchedule(prescriptionOnSave)
                prescriptionOnSave.schedule = schedule
            
            await Prescription.updateOne({_id:prescriptionOnSave._id}, {$set:prescriptionOnSave})
            
            let prescriptionWithSchedule = await Prescription.findOne({_id:prescriptionOnSave._id}).populate('schedule').exec()
            
            console.log('with populate', prescriptionWithSchedule)
            
            res.status(200).json(prescriptionWithSchedule)
        }catch (error) {
            res.status(400).json({message:error})
        }
    } else {
        res.status(400).json({message:'your medicine is expired!'})
    } 
}


module.exports = {
    get,
    add
}