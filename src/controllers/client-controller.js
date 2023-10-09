const { PrismaClient } = require('@prisma/client')
const utils = require('../utils/utils')

const prisma = new PrismaClient()

const getClients = async (req, res) => {
  try {
    const id = req.params.id

    const clients = await prisma.client.findMany({
      where: {
        id: id,
      },
    })

    if (clients) {
      res.status(200).json(clients)
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    console.error('Error', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const getClient = async (req, res) => {
  try {
    const id = req.params.id

    const client = await prisma.client.findUnique({
      where: {
        id: id,
      },
    })

    if (client) {
      res.status(200).json(client)
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const registerClient = async (req, res) => {

}

const updateClient = async (req, res) => {

}

const deleteClient = async (req, res) => {

}

module.exports = {
  getClient,
  getClients,
  updateClient,
  deleteClient,
  registerClient,
}
