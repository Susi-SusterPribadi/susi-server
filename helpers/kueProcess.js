const kue = require('kue')
  , queue = kue.createQueue();
require('dotenv').config()
const scheduleCron = require('../cron/schedule')
const port = 3001

queue.process('schedule', function(job, done){
  let user = job.data.userId  
  let prescription = job.data.prescription
  let time = job.data.time
  // console.log(new Date(time).toLocaleString());
  scheduleCron(job.data)
  done()
});


kue.app.listen(3001, () => {
  console.log("kue on running on port :", port)
});