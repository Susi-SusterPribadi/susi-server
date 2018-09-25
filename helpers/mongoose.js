require('dotenv').config()
const mongoose = require('mongoose')
const Schedule = require('../models/schedule')
const Prescription = require('../models/prescription')
const Config = require('../models/config')
const Failed = require('../models/failed')
let MONGO_URI = {
    development:`mongodb://${process.env.dbProdAdm}:${process.env.dbProdAdm}@ds259912.mlab.com:59912/susidb`,
    test:`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
  }


const drugsSafely = async (userId, emmit) => {
    // mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
        //get schedule
        //get $time lt now
        //set isDrunk to true
        let query = {
            userId: userId,
            time: {
                $lt: new Date()
            },
            isDrunk: false
        }
        let schedules = await Schedule.find(query).populate('userId').populate('prescriptionId').exec()
        console.log("drugsSafely at ", new Date().toLocaleString())
      
        if(schedules.length != 0 ){
            let medicines = Promise.all(schedules.map(async schedule => {
                                let id = schedule._id
                                await Schedule.updateOne({ _id:id }, {$set:{isDrunk: true}})
                                await Prescription.updateOne({_id:schedule.prescriptionId._id}, {$inc:{stock: -1}})
                                return schedule.prescriptionId.label
                            }))
            console.log(medicines)
            return medicines
        }else {
            console.log("kamu ga punya jadwal minum obat, saat nya menjaga kesehatan")
            return ["kamu ga punya jadwal minum obat, saat nya menjaga kesehatan"]
        }

    // })
}  

const pendingDrugs = async (userId, emmit) => {
    let query = {
        userId: userId,
        time: {
            $lt: new Date()
        },
        isDrunk: false
    }
    let config = await Config.findOne({userId:userId})
    let schedules = await Schedule.find(query).populate('userId').populate('prescriptionId').exec()
    console.log("==========================")
    console.log(config)
    console.log(schedules)
    console.log("==========================")
    let reply = await Promise.all(schedules.map(async schedule => {
                                console.log(new Date(schedule.time).toLocaleString(), ", isDrunk :", schedule.isDrunk)
                                
                                let id = schedule._id
                                let oldTime = new Date(schedule.time)
                                let timeIncrement = new Date( new Date().getTime() + (60000 * 2))
                                //if morning be afternoon, if afternoon be night, if night equal night
                                let nextSession = ''
                                switch(schedule.onSchedule){
                                    case 'morning': nextSession='afternoon';break;
                                    case 'afternoon': nextSession='night';break;
                                    case 'night': nextSession='night'; break;
                                    default: nextSession = scheduleOnConfig;
                                }
                                console.log("=========",nextSession)
                                let scheduleOnConfig = config[nextSession].split(':')
                                let hour = scheduleOnConfig[0]
                                let minute = scheduleOnConfig[1]
                                let ruleOfSchedule = new Date()
                                    ruleOfSchedule.setHours( hour )
                                    ruleOfSchedule.setMinutes(minute)
                                    ruleOfSchedule.setSeconds(0)
                                    timeIncrement.setSeconds(0)
                                    console.log(schedule.onSchedule, "schedule on config : ", scheduleOnConfig ," old :", oldTime.toLocaleString(), "early : ", timeIncrement.toLocaleString(), "rule: ", ruleOfSchedule.toLocaleString())
                                if(timeIncrement > ruleOfSchedule){
                                    //created failed on database

                                    let onFailed = await Schedule.findOne({_id:schedule._id})
                                    let newFailed = new Failed({
                                        userId: onFailed.userId, 
                                        prescriptionId: onFailed.prescriptionId,
                                        time: new Date(onFailed.time), 
                                        isDrunk:onFailed.isDrunk, 
                                        onSchedule: onFailed.onSchedule
                                    })
                                    await newFailed.save()

                                    console.log(`oppss.. medicine is forgeted, ${schedule.prescriptionId.label}`)
                                    return `oppss.. medicine is forgeted, ${schedule.prescriptionId.label}`
                                    
                                }else {
                                    await Schedule.updateOne({_id:id}, {$set:{time:timeIncrement}})
                                    console.log('injury time')
                                    return `kamu menunda minum ${schedule.prescriptionId.label} selama 2 menit`
                                }                    
                    }))
                    
    console.log("pending report :",reply)
    return reply
}

const scheduleDrugs = async (userId, emmit) => {
        let late = new Date()
            late.setHours(23)
        let early = new Date()
            early.setHours(0)
        let query = {
            userId: userId,
            time: {
                $gte: early,
                $lt: late
            },
            isDrunk: false
        }
        let schedules = await Schedule.find(query).populate('userId').populate('prescriptionId').exec()
        console.log("get own schedule at ", new Date().toLocaleString())
        if(schedules.length != 0 ){
            let reply = schedules.map( schedule => {
                    // console.log( `halo  ${schedule.userId.name}  obat yang harus kamu minum ${schedule.prescriptionId.label}, pada ${schedule.onSchedule} pukul ${schedule.time.toLocaleString()}`)
                    return `halo  ${schedule.userId.name}  obat yang harus kamu minum ${schedule.prescriptionId.label}, pada ${schedule.onSchedule} pukul ${schedule.time.toLocaleString()}`
                })
            console.log(reply)
            return reply
        }else {
            console.log("kamu ga punya jadwal minum obat, saat nya menjaga kesehatan")
            return ["kamu ga punya jadwal minum obat, saat nya menjaga kesehatan"]
        }
}

const failedDrugs = async (userId, emmit) => {      
        let query = {
            userId: userId,
        }
        let schedules = await Failed.find(query).populate('userId').populate('prescriptionId').exec()
        
        if(schedules.length != 0 ){
            let reply = schedules.map(schedule => {
                            // console.log( `halo  ${schedule.userId.name}  obat yang tidak kamu minum ${schedule.prescriptionId.label}, pada ${schedule.onSchedule} pukul ${schedule.time.toLocaleString()}`)
                            return `halo  ${schedule.userId.name}  obat yang tidak kamu minum ${schedule.prescriptionId.label}, pada ${schedule.onSchedule} pukul ${schedule.time.toLocaleString()}`
                        })
            console.log(reply)
            return reply
        }else {
            console.log("kamu ga punya jadwal minum obat, saat nya menjaga kesehatan")
            return ["kamu ga punya jadwal minum obat, saat nya menjaga kesehatan"]
        }
}


    
 


module.exports = {

    getChat : (word, userId, emmit) => {
        switch(word){
            case 'OKE' : console.log('HEBAT, kamu sudah minum obat'); return drugsSafely(userId, null);
            case 'TUNDA' : console.log('YAHHH, ingat kesehatan lebih penting daripada uang'); pendingDrugs(userId, null);
            case 'JADWAL' : console.log('ini nih jadwal kamu :');return scheduleDrugs(userId, null);
            case 'FAILED' : console.log('list kelalaian kamu :');return failedDrugs(userId, null);
        }
    },

}