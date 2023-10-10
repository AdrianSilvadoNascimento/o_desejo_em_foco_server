const express = require('express')

const itemController = require('../controllers/items-controller')

const router = express.Router()

router.get('/:id', itemController.getItems)
router.get('/get-item/:id', itemController.getItem)
router.put('/update-item/:id', itemController.updateItem)
router.post('/register-item/:id', itemController.registerItem)
router.delete('/delete-item/:id', itemController.deleteItem)

module.exports = router
