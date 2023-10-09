const express = require('express')

const clientController = require('../controllers/client-controller')

const router = express.Router()

router.get('/get-client/:id', clientController.getClient)
router.get('/get-clients/:id', clientController.getClients)
router.put('/update-client/:id', clientController.updateClient)
router.delete('/delete-client/:id', clientController.deleteClient)
router.post('/register-client/:id', clientController.registerClient)

module.exports = router