const express = require('express')
const ValidateAuthToken = require('../utils/validateAuthToken.js')
const ClientController = require('../controllers/client-controller.js')

const clientController = new ClientController()
const validateAuthToken = new ValidateAuthToken()

const router = express.Router()

router.get('/get-client/:id', validateAuthToken.validateToken, clientController.getClient)
router.get('/get-clients/:id', validateAuthToken.validateToken, clientController.getClients)
router.put('/update-client/:id', validateAuthToken.validateToken, clientController.updateClient)
router.delete('/delete-client/:id', validateAuthToken.validateToken, clientController.deleteClient)
router.post('/register-client/:id', validateAuthToken.validateToken, clientController.registerClient)

module.exports = router
