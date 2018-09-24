const router = require("express").Router();
const { textRecognition } = require('../controllers/recognition')
const { uploadS3 } = require('../helpers/uploads3')
const isUserActive = require('../middlewares/isUserActive')

router.post('/uploads3', isUserActive, uploadS3, textRecognition)
module.exports = router;
