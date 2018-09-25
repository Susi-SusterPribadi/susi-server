const socketio = require('socket.io-client')

const socketClient = socketio(process.env.socketUrl) 
console.log("env on socket :", process.env.socketUrl)
module.exports = socketClient