const router = require('express').Router()
const controller = require('../controllers/config')
const isUserActive = require('../middlewares/isUserActive')

router.get('/', isUserActive)
        .post('/', isUserActive)
        .put('/', isUserActive)
        .delete('/', isUserActive)

module.exports = router