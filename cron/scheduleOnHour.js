require('dotenv').config()
const CronJob = require('cron').CronJob;
const mongoose = require('mongoose')
const Schedule = require('../models/schedule')
const User = require('../models/users')
const Prescription = require('../models/prescription')

module.exports = () => {
 console.log("cron on triger")

 new CronJob(`0 */1 * * * *`, function() {
    let MONGO_URI = {
        development:`mongodb://${process.env.dbProdAdm}:${process.env.dbProdAdm}@ds259912.mlab.com:59912/susidb`,
        test:`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
      }
      mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
            if(err) console.log("connect with mLab on error : ", err)
            try{
                let now = new Date()
                let nextMinute =  new Date( now.getTime() + 60000)
                
                let scheduleOnDb = await Schedule.find({
                        time: {
                            $gte: now,
                            $lt: nextMinute
                        }
                    }).populate('userId').populate('prescriptionId').exec()

                console.log(new Date().toLocaleString())
                console.log(now.toLocaleString(), nextMinute.toLocaleString())
                
                scheduleOnDb.forEach(e => {
                    console.log(`${e.userId.name} saatnya minum obat : ${e.prescriptionId.label}, stock : ${e.prescriptionId.stock}`)
                })
                
                console.log("-=======++++++++++++++++++++++++++")          
            } catch (error) {
                console.log(error)
            }
        })
        
      }, null, true, 'Asia/Jakarta');
}
