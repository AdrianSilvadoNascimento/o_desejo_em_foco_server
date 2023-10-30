const express = require('express')

const ValidateAuthToken = require('../utils/validateAuthToken.js')
const UserController = require('../controllers/user-controller')

const validateAuthToken = new ValidateAuthToken()
const userController = new UserController()

const router = express.Router()

router.post('/register-user', userController.registerUser)
router.post('/login-user', userController.loginUser)
router.post('/register-employee', validateAuthToken.validateToken, userController.registerEmployee)

module.exports = router
