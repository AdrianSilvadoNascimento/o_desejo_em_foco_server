const { PrismaClient } = require('@prisma/client')
const utils = require('../utils/utils')

const prisma = new PrismaClient()

const getClients = async (req, res) => {
  try {
    const id = req.params.id

    const clients = await prisma.client.findMany({
      where: {
        user_id: id,
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
  try {
    const body = req.body
    const userId = req.params.id

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (user) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          clients: {
            create: {
              name: body.name,
              lastname: body.lastname,
              age: body.age,
              email: body.email,
              buy_quantity: 1,
              address: {
                create: {
                  street: body.street,
                  house_number: parseInt(body.house_number),
                  country: body.country,
                  neighborhood: body.neighbourhood,
                  postal_code: body.postal_code,
                },
              },
            },
          },
        },
      })

      res.status(200).json({ message: 'Cliente registrado com sucesso!' })
    } else {
      res.status(404).json({ message: 'Estabelecimento não encontrado' })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
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
