const Prescription = require('../models/prescription')
const Config  = require('../models/config')
const Schedule = require('../models/schedule')



const generateSchedule = async (config, prescription) => {
    let arrSchedule = []
    //userId, prescriptonId, time
    //time : new Date(2011, 0, 1, 0, 0, 0, 0); // // 1 Jan 2011, 00:00:00
    let startDatePrescription = new Date(prescription.createdAt)
    console.log(startDatePrescription.toLocaleString(), 'start')
    let stock = prescription.stock
    let times = prescription.times
    
    //to make function need parameter : config, times, stock, return array of scheduleOfDay        
    if(times > 3){
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
    } else {
        let timeOnConfig = []

        
        let cycle = 0
        switch(times){
            case 3 : timeOnConfig = [config.morning, config.afternoon, config.night]; break;
            case 2 : timeOnConfig = [config.morning, config.night]; break;
            case 1 : timeOnConfig = [config.morning]; break;
            default : []
        }
        
        //function getFirstTime
        let firstHours = startDatePrescription.getHours().toLocaleString()
        let firstDrugs = 0
        if(firstHours > 0 && firstHours < timeOnConfig[1]){
            firstDrugs = timeOnConfig[0]
        }else if ( firstHours > timeOnConfig[0] && firstHours < timeOnConfig[2]) {
            firstDrugs = timeOnConfig[1]
        }else {
            firstDrugs = config.night[2]
        }
        console.log("first drugs :", firstDrugs)
        while(stock > 0 ){
            let j = cycle === 0 ? timeOnConfig.indexOf(firstDrugs) : 0;
            // console.log(j)
            for(let i = j; i < timeOnConfig.length; i++){
                let scheduleGetTime = new Date(startDatePrescription)
                let year = scheduleGetTime.getFullYear()
                let month = scheduleGetTime.getMonth()
                let date = scheduleGetTime.getDate()
                let hour = timeOnConfig[i]
                let diff = timeOnConfig[i] - timeOnConfig[i-1]
                if(stock > 0){
                    console.log(new Date(year, month, date, hour).toLocaleString(), 'stock : ', stock, diff)
                    let newTime = new Date(year, month, date, hour)
                    let newSchedule = {
                        userId:prescription.userId,
                        prescriptionId: prescription._id,
                        time: newTime
                    }
                    console.log(newSchedule)
                    let schedule = new Schedule(newSchedule)
                    let scheduleSave = await schedule.save()
                    arrSchedule.push(scheduleSave._id)
                }
                startDatePrescription.setHours(startDatePrescription.getHours() + (diff ? diff : 0))
                if(timeOnConfig.length-1  === i){
                    startDatePrescription.setDate(startDatePrescription.getDate() + 1)
                }
                cycle++
                stock --
            }
        }
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
    console.log(new Date())
    
    if( new Date() < new Date(body.expDate)){
        try{

            console.log("presription /post request: ",body)
            let prescription =  new Prescription(body)
            let config = await Config.findOne({userId:body.userId})
            let prescriptionOnSave =  await prescription.save( )

            let schedule = await generateSchedule(config, prescriptionOnSave)
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