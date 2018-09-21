const mongoose = require('mongoose')
const User = require('../models/users')
module.exports = function (io) { 


    let MONGO_URI = {
        development:`mongodb://${process.env.dbProdAdm}:${process.env.dbProdAdm}@ds259912.mlab.com:59912/susidb`,
        test:`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
      }
      
      mongoose.connect(MONGO_URI[process.env.NODE_ENV], { useNewUrlParser: true } ,function(err){
        if(err){
          console.log("connect with mLab on error : ", err)
        }
        console.log("connect with mLab on base socket : ", MONGO_URI[process.env.NODE_ENV]  )
        console.log('masuk base')

        User.find()
        .then( res => {

           console.log('data dari base :', res) 

        })
        .catch( err => {
            console.log('ERROR from base socket :',err)
            // io.emit('chat message', err.message)
        })

        io.on('connection', (socket) => {
            console.log('A client just joined on');
            socket.on('disconnect', function(){
              console.log('user disconnected');
            });
    
            socket.on('chat message', function(msg){
                console.log(`message from ${socket.id} : ` + msg);
                if(msg === 'test'){
                    io.emit('chat message', 'iya nih tambahan kata')
                } else {
                    io.emit('chat message', msg);
                }
            });
        });

      })


    
    // io stuff here... io.on('conection..... 
}