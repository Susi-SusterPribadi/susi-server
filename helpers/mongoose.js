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


const drugsSafely = (userId, emmit) => {
    mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
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
        // console.log(schedules)
        if(schedules.length != 0 ){
            schedules.forEach(async schedule => {
                let id = schedule._id
                await Schedule.updateOne({ _id:id }, {$set:{isDrunk: true}})
                await Prescription.updateOne({_id:schedule.prescriptionId._id}, {$inc:{stock: -1}})
            })
        }else {
            console.log("kamu ga punya jadwal minum obat, saat nya menjaga kesehatan")
        }

    })
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
    schedules.forEach(async schedule => {
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
        
        if(timeIncrement > ruleOfSchedule){
            //created failed on database
            console.log('oppss.. medicine is forgeted',schedule._id)
            let scheduleOnFailed = await Schedule.findById(schedule._id)
            let newFailed = new Failed(scheduleOnFailed)
            await newFailed.save()
            
        }else {
            console.log('injury time')
            await Schedule.updateOne({_id:id}, {$set:{time:timeIncrement}})
        }

        // console.log("ruleOfSchedule :", ruleOfSchedule, config)
        console.log(schedule.onSchedule, "schedule on config : ", scheduleOnConfig ," old :", oldTime.toLocaleString(), "early : ", timeIncrement.toLocaleString(), "rule: ", ruleOfSchedule.toLocaleString())
        // console.log(id, schedule.isDrunk)
        // console.log(schedule.prescriptionId, "========")
       
         
    })

}

const scheduleDrugs = async (userId, emmit) => {
    mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
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
            schedules.forEach(async schedule => {
                console.log( `halo  ${schedule.userId.name}  obat yang harus kamu minum ${schedule.prescriptionId.label}, pada ${schedule.onSchedule} pukul ${schedule.time.toLocaleString()}`)
            })
        }else {
            console.log("kamu ga punya jadwal minum obat, saat nya menjaga kesehatan")
        }

    })
}

const failedDrugs = async (userId, emmit) => {
    mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
        
        let query = {
            userId: userId,
        }
        let schedules = await Schedule.find(query).populate('userId').populate('prescriptionId').exec()
        
        if(schedules.length != 0 ){
            schedules.forEach(schedule => {
                console.log( `halo  ${schedule.userId.name}  obat yang tidak kamu minum ${schedule.prescriptionId.label}, pada ${schedule.onSchedule} pukul ${schedule.time.toLocaleString()}`)
            })
        }else {
            console.log("kamu ga punya jadwal minum obat, saat nya menjaga kesehatan")
        }

    })   
}


    
 


module.exports = {

    getChat : (word, userId, emmit) => {
        switch(word){
            case 'OKE' : drugsSafely(userId, null);console.log('HEBAT, kamu sudah minum obat');break;
            case 'TUNDA' : pendingDrugs(userId, null);console.log('YAHHH, ingat kesehatan lebih penting daripada uang');break;
            case 'JADWAL' : scheduleDrugs(userId, null);console.log('ini nih jadwal kamu :'); break;
            case 'FAILED' : failedDrugs(userId, null);console.log('list kelalaian kamu :'); break;
        }
    }

}