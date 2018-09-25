require('dotenv').config()
const CronJob = require('cron').CronJob;
const mongoose = require('mongoose')
const Schedule = require('../models/schedule')
const User = require('../models/users')
const Prescription = require('../models/prescription')
// const io = require('../helpers/socketClient')
module.exports = () => {
 console.log("cron on triger")

 new CronJob(`0 */1 * * * *`, function() {
    // io.emit('message', 'from API ')
    console.log('testtttttt')
    let MONGO_URI = {
        development:`mongodb://${process.env.dbProdAdm}:${process.env.dbProdAdm}@ds259912.mlab.com:59912/susidb`,
        test:`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
      }
      mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true } ,async function(err){
            if(err) console.log("connect with mLab on error : ", err)
            try{
                console.log("===============================================")
                    let scheduleOnDb = await Schedule.find({
                            time:{
                                $gt : (new Date()).setSeconds(-60),
                                $lte : (new Date()).setSeconds(0)
                            },
                        }).populate('userId').populate('prescriptionId').exec()

                    
                    console.log("time on tick on minute : ", new Date().toLocaleString(), "; range :", new Date( new Date().setSeconds(60) ).toLocaleString() )
                    console.log("--------------------------------------------------")
                    scheduleOnDb.forEach(e => {
                        console.log(`${e.onSchedule} ini ${e.userId.name} saatnya minum obat : ${e.prescriptionId.label}, stock : ${e.prescriptionId.stock}`)
                        let message = `${e.onSchedule} ini ${e.userId.name} saatnya minum obat : ${e.prescriptionId.label}, stock : ${e.prescriptionId.stock}`
                        // io.emit('message', message )
                    })
                    console.log("--------------------------------------------------")
                
                    console.log("===============================================")          
            } catch (error) {
                console.log(error)
            }
        })
        
      }, null, true, 'Asia/Jakarta');
}
