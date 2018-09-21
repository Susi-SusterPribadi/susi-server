const router = require("express").Router();
const { textRecognition } = require('../controllers/recognition')
const { uploadS3 } = require('../helpers/uploads3')

router.post('/uploads3', uploadS3, textRecognition)
module.exports = router;
