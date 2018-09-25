var express = require('express');
var router = express.Router();
<<<<<<< HEAD
=======

const io = require('socket.io-client')(process.env.socketUrl);

>>>>>>> add socket client
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: 'Connected to Susi API' });
});

module.exports = router;
