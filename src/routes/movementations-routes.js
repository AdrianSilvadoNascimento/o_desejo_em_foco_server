const express = require('express')

const movementationController = require('../controllers/movementations-controller')

const router = express.Router()

router.post('/move', movementationController.move)

module.exports = router
