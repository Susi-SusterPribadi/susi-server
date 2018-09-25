var express = require('express');
var router = express.Router();
const io = require('../helpers/socketClient')
/* GET home page. */
router.get('/', function(req, res, next) {
  io.emit('message', 'test dari routes index')
  res.status(200).json({ message: 'Connected to Susi API' });
});

module.exports = router;
