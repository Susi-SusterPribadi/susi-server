const socketio = require('socket.io-client')

module.exports = socketio(process.env.socketUrl)