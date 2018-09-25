const Prescription = require('../models/prescription');
const Config = require('../models/config');
const Schedule = require('../models/schedule');
const kue = require('../helpers/kueCreate');

const generateSchedule = async (config, prescription) => {
  let arrSchedule = [];
  //userId, prescriptonId, time
  //time : new Date(2011, 0, 1, 0, 0, 0, 0); // // 1 Jan 2011, 00:00:00
  let startDatePrescription = new Date(prescription.createdAt);
  console.log(startDatePrescription.toLocaleString(), 'start');
  let stock = prescription.stock;
  let times = prescription.times;
  console.log(stock, times);
  //to make function need parameter : config, times, stock, return array of scheduleOfDay
  if (times > 3) {
    let interval = 24 / times;
    while (stock > 0) {
      for (let i = 0; i < times; i++) {
        let scheduleGetTime = startDatePrescription;
        // console.log(prescription._id, ', on :', scheduleGetTime)
        let schedule = new Schedule({
          userId: prescription.userId,
          prescriptionId: prescription._id,
          time: scheduleGetTime
        });
        let scheduleSave = await schedule.save();
        arrSchedule.push(scheduleSave._id);
        startDatePrescription.setHours(
          startDatePrescription.getHours() + interval
        );
      }
      stock -= times;
    }
  } else {
    let timeOnConfig = [];
    let minuteOnConfig = [];
    let secondOnConfig = [];

    let morning = Number(config.morning.split(':')[0]);
    let minuteMorning = Number(config.morning.split(':')[1]);
    let secondMorning = Number(config.morning.split(':')[2]);

    let afternoon = Number(config.afternoon.split(':')[0]);
    let minuteAfternoon = Number(config.afternoon.split(':')[1]);
    let secondAfternoon = Number(config.afternoon.split(':')[2]);

    let night = Number(config.night.split(':')[0]);
    let minuteNight = Number(config.night.split(':')[1]);
    let secondNight = Number(config.night.split(':')[2]);
    console.log(
      'morning :',
      morning,
      'afternoon :',
      afternoon,
      'night :',
      night
    );
    let cycle = 0;
    switch (times) {
      case 3:
        timeOnConfig = [morning, afternoon, night];
        minuteOnConfig = [minuteMorning, minuteAfternoon, minuteNight];
        secondOnConfig = [secondMorning, secondAfternoon, secondNight];
        onScheduleConfig = ['morning', 'afternoon', 'night'];
        break;
      case 2:
        timeOnConfig = [morning, night];
        minuteOnConfig = [minuteMorning, minuteNight];
        secondOnConfig = [secondMorning, secondNight];
        onScheduleConfig = ['morning', 'night'];
        break;
      case 1:
        timeOnConfig = [morning];
        minuteOnConfig = [minuteMorning];
        secondOnConfig = [secondMorning];
        onScheduleConfig = ['morning'];
        break;

      default:
        [];
    }
    //function getFirstTime
    let firstHours = startDatePrescription.getHours().toLocaleString();
    let firstDrugs = 0;
    if (firstHours >= 0 && firstHours <= timeOnConfig[0]) {
      firstDrugs = timeOnConfig[0];
    } else if (firstHours > timeOnConfig[0] && firstHours <= timeOnConfig[1]) {
      firstDrugs = timeOnConfig[1];
    } else {
      firstDrugs = timeOnConfig[timeOnConfig.length - 1];
    }
    console.log('first drugs :', firstDrugs, timeOnConfig, minuteOnConfig);
    while (stock > 0) {
      let j = cycle === 0 ? timeOnConfig.indexOf(firstDrugs) : 0;
      for (let i = j; i < timeOnConfig.length; i++) {
        let scheduleGetTime = new Date(startDatePrescription);
        let year = scheduleGetTime.getFullYear();
        let month = scheduleGetTime.getMonth();
        let date = scheduleGetTime.getDate();
        let hour = timeOnConfig[i];
        let minute = minuteOnConfig[i];
        let second = secondOnConfig[i];
        let onSchedule = onScheduleConfig[i];
        let diff = timeOnConfig[i] - timeOnConfig[i - 1];
        if (stock > 0) {
          console.log(
            new Date(year, month, date, hour, minute, second).toLocaleString(),
            'stock : ',
            stock,
            diff
          );
          let newTime = new Date(year, month, date, hour, minute, second);
          let newSchedule = {
            userId: prescription.userId,
            prescriptionId: prescription._id,
            time: newTime,
            isDrunk: false,
            onSchedule: onSchedule
          };
          let schedule = new Schedule(newSchedule);
          let scheduleSave = await schedule.save();
          // console.log(scheduleSave.time)

          //kue create
          // kue.scheduleCreate(scheduleSave)
          arrSchedule.push(scheduleSave._id);
        }
        // startDatePrescription.setHours(startDatePrescription.getHours() + (diff ? diff : 0))
        if (timeOnConfig.length - 1 === i) {
          startDatePrescription.setDate(startDatePrescription.getDate() + 1);
        }
        cycle++;
        stock--;
      }
    }
  }

  // console.log(schedule)
  // tomorrow.setDate(tomorrow.getDate() + 1);

  return arrSchedule;
};

const get = async ({ query }, res) => {
  try {
    let prescription = await Prescription.find({ userId: query.userId })
      .populate('schedule')
      .exec();
    console.log(prescription);
    res.status(200).json({ body: prescription });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const add = async ({ body }, res) => {
  // if( new Date() < new Date(body.expDate)){
  try {
    let newPrescription = await createPrescription(body, null);
    console.log(
      'create prescription: ',
      newPrescription,
      new Date(newPrescription.updatedAt).toLocaleString()
    );
    res.status(200).json(newPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  // } else {
  //     res.status(400).json({message:'your medicine is expired!'})
  // }
};

const createPrescription = async (data, emmit) => {
  //need mongoose connection and models
  try {
    let prescriptionList = await Prescription.findOne({ label: data.label });
    let config = await Config.findOne({ userId: data.userId });
    // console.log("find prescription : ",prescriptionList)
    if (prescriptionList) {
      let newPrescription = prescriptionList;
      await Schedule.deleteMany({ prescriptionId: prescriptionList });
      newPrescription.schedule = [];
      newPrescription.stock = data.stock;
      newPrescription.times = data.times;
      let schedule = await generateSchedule(config, newPrescription);
      newPrescription.schedule = schedule;

      await Prescription.updateOne(
        { _id: newPrescription._id },
        { $set: newPrescription }
      );
      let prescriptionWithSchedule = await Prescription.findOne({
        _id: newPrescription._id
      })
        .populate('schedule')
        .exec();

      return prescriptionWithSchedule;
    } else {
      let prescription = new Prescription(data);
      let prescriptionOnSave = await prescription.save();

      let schedule = await generateSchedule(config, prescriptionOnSave);
      prescriptionOnSave.schedule = schedule;

      await Prescription.updateOne(
        { _id: prescriptionOnSave._id },
        { $set: prescriptionOnSave }
      );

      let prescriptionWithSchedule = await Prescription.findOne({
        _id: prescriptionOnSave._id
      })
        .populate('schedule')
        .exec();

      return prescriptionWithSchedule;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  get,
  add,
  createPrescription
};
