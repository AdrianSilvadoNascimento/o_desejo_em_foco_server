const express = require('express')

const itemController = require('../controllers/items-controller')

const router = express.Router()

router.get('/', itemController.getItems)
router.post('/register-item', itemController.registerItem)
router.put('/update-item/:id', itemController.updateItem)
router.delete('/delete-item/:id', itemController.deleteItem)

module.exports = router
