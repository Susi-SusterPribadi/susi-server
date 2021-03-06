const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
const busboy = require('connect-busboy')
const busboyBodyParser = require('busboy-body-parser')

require('dotenv').config()

let MONGO_URI = {
  development:`mongodb://${process.env.dbProdAdm}:${process.env.dbProdAdm}@ds259912.mlab.com:59912/susidb`,
  test:`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
}

mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true } ,function(err){
  if(err){
    console.log("connect with mLab on error : ", err)
  }
  console.log("connect with mLab on : ", MONGO_URI[process.env.NODE_ENV]  )
})

//routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const prescriptionRouter = require('./routes/prescription');
const configRouter = require('./routes/config')
const scheduleRouter = require('./routes/schedule')
const awsRouter = require('./routes/aws')
const chatRouter = require('./routes/chat')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(busboy())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboyBodyParser())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/prescription', prescriptionRouter)
app.use('/config', configRouter)
app.use('/schedule', scheduleRouter)
app.use('/aws', awsRouter)
app.use('/chat', chatRouter)

//cron on walk
require('./cron/scheduleOnHour')()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: 'Resource not found.'
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: 'Oops..! Something went wrong on the server.',
    error: err
  });
});

const {getChat} = require('./helpers/mongoose')
var stdin = process.openStdin();

stdin.addListener('data', function(d) {
  let word = d.toString().trim()
  let userId = '5ba34bb4c70a9640927e9caa'
  getChat(word, userId)
});
module.exports = app;
