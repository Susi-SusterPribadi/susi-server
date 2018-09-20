const express = require('express');
const router = express.Router();
const controllerUsers = require('../controllers/users')

/* GET users listing. */
router.get('/', controllerUsers.get)
      .post('/', controllerUsers.add)

module.exports = router;
