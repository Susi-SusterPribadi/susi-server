require('dotenv').config()
const CronJob = require('cron').CronJob;
const mongoose = require('mongoose')
const Schedule = require('../models/schedule')
const User = require('../models/users')
const Prescription = require('../models/prescription')

module.exports = (data) => {
 console.log("di cron", new Date(data.time).getHours())
 let month = new Date(data.time).getMonth()
 let date = new Date(data.time).getDate()
 let hour = new Date(data.time).getHours()
 let minute = new Date(data.time).getMinutes()
 let second = new Date(data.time).getSeconds()

 console.log(second, minute, hour, date, month, '*')
 let schedule = new CronJob(`${second} ${minute} ${hour} ${date} ${month} *`, function() {
    let MONGO_URI = {
        development:`mongodb://${process.env.dbProdAdm}:${process.env.dbProdAdm}@ds259912.mlab.com:59912/susidb`,
        test:`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
      }
      mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
            if(err) console.log("connect with mLab on error : ", err)
            try{
                let scheduleOnDb = await Schedule.findOne({_id:data._id})
                let user = await User.findOne({_id:data.userId})
                let prescription = await Prescription.findOne({_id:data.prescriptionId})
                
                if(scheduleOnDb){
                    //connect chatbot
                    console.log(new Date().toLocaleString())
                    console.log(user.name, "saatnya makan obat :", prescription.label);

                    //on talking, may pending in 10 minutes later
                    await Schedule.findOneAndDelete({_id:data._id})

                }else {
                    console.log(prescription.label, "schedule di hapus")
                    schedule.stop()
                }
            } catch (error) {
                console.log(error)
                schedule.stop()
            }
        })
        
      }, null, true, 'Asia/Jakarta');
}
