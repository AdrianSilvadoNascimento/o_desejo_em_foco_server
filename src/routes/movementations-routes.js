const express = require('express')

const MovementationController = require('../controllers/movementations-controller.js')
const ValidateAuthToken = require('../utils/validateAuthToken.js');

const movementationController = new MovementationController()
const validateAuthToken = new ValidateAuthToken()

const router = express.Router()

router.get('/:id', validateAuthToken.validateToken, movementationController.movementations)
router.post('/move', validateAuthToken.validateToken, movementationController.move)
router.delete('/delete-move/:id', validateAuthToken.validateToken, movementationController.deleteMovementation)

module.exports = router
