module.exports = function (io) { 
    console.log('masuk base')
    io.on('connection', (socket) => {
        console.log('A client just joined on');
        socket.on('disconnect', function(){
          console.log('user disconnected');
        });

        socket.on('chat message', function(msg){
            console.log(`message from ${socket.id} : ` + msg);
            io.emit('chat message', {msg:msg, info:'terkirim'});
        });
    });

    
    // io stuff here... io.on('conection..... 
}