const router = require('express').Router()
const controller = require('../controllers/schedule')
router.get('/', controller.get)


module.exports = router