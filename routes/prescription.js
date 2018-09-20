const express = require('express')
const router = express.Router()
const isUserActive = require('../middlewares/isUserActive')
const controller = require('../controllers/prescription')

router.get('/', isUserActive, controller.get)

module.exports = router
