const express = require('express')
const USER_CONTROLLER = require('../controllers/UserController')

const router = express.Router()

router.get('/', USER_CONTROLLER.select)
router.post('/', USER_CONTROLLER.insert)

module.exports = router
