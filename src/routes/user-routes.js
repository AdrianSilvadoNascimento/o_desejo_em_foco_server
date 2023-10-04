const express = require('express')

const userController = require('../controllers/user-controller')

const router = express.Router()

router.post('/register-user', userController.registerUser)
router.post('/login-user', userController.loginUser)
router.post('/register-employee', userController.registerEmployee)

module.exports = router
