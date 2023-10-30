const express = require('express')

const ItemController = require('../controllers/items-controller.js')
const ValidateAuthToken = require('../utils/validateAuthToken.js')

const itemController = new ItemController()
const validateAuthToken = new ValidateAuthToken()

const router = express.Router()

router.get('/:id', validateAuthToken.validateToken, itemController.getItems)
router.get('/get-item/:id', validateAuthToken.validateToken, itemController.getItem)
router.get('/get-item-by-barcode/:barcode', validateAuthToken.validateToken, itemController.getItemByBarcode)
router.put('/update-item/:id', validateAuthToken.validateToken, itemController.updateItem)
router.post('/register-item/:id', validateAuthToken.validateToken, itemController.registerItem)
router.delete('/delete-item/:id', validateAuthToken.validateToken, itemController.deleteItem)

module.exports = router
