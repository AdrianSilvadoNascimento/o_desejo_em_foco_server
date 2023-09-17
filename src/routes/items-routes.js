const express = require('express')

const itemController = require('../controllers/items-controller')

const router = express.Router()

router.get('/', itemController.getItems)
router.get('/:id', itemController.getItem)
router.put('/update-item/:id', itemController.updateItem)
router.post('/register-item', itemController.registerItem)
router.delete('/delete-item/:id', itemController.deleteItem)

module.exports = router
