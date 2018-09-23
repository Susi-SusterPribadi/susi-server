const router = require('express').Router()
const controller = require('../controllers/config')
const isUserActive = require('../middlewares/isUserActive')

router.get('/', isUserActive, controller.getById)
        .post('/', isUserActive, controller.create)
        .put('/', isUserActive, controller.update)
        .delete('/', isUserActive)

module.exports = router