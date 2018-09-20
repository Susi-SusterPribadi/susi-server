const express = require('express')
const router = express.Router()
const ControllerAuth = require('../controllers/auth')

router
    .post('/', ControllerAuth.login)
    
module.exports = router