const express = require('express')

const movementationController = require('../controllers/movementations-controller')

const router = express.Router()

router.get('/:id', movementationController.movementations)
router.post('/move', movementationController.move)
router.delete('/move/:id', movementationController.deleteMovementation)

module.exports = router
