const { PrismaClient } = require('@prisma/client')
const utils = require('../utils/utils')

const prisma = new PrismaClient()

class ClientController {
  async getClients(req, res) {
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
  
  async getClient(req, res) {
    try {
      const id = req.params.id
  
      const client = await prisma.client.findUnique({
        where: {
          id: id,
        },
        include: {
          address: true,
        },
      })
  
      if (client) {
        const {
          country,
          created_at,
          house_number,
          neighborhood,
          postal_code,
          street,
          updated_at,
        } = client.address[0]
  
        const clientWithoutAddress = {
          ...client,
          address: undefined,
          country,
          created_at,
          house_number,
          neighborhood,
          postal_code,
          street,
          updated_at,
        }
  
        res.status(200).json(clientWithoutAddress)
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' })
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: utils.errorMessage })
    }
  }
  
  async registerClient(req, res) {
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
                sex: body.sex,
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
  
  async updateClient(req, res) {
    try {
      const clientId = req.params.id
      const body = req.body
  
      const client = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      })
  
      if (client) {
        await prisma.client.update({
          where: {
            id: clientId,
          },
          data: {
            name: body.name,
            lastname: body.lastname,
            age: body.age,
            email: body.email,
            sex: body.sex,
            updated_at: new Date().toISOString(),
          },
        })
  
        await prisma.clientAddress.update({
          where: {
            client_id: clientId,
          },
          data: {
            street: body.street,
            house_number: parseInt(body.house_number),
            country: body.country,
            neighborhood: body.neighbourhood,
            postal_code: body.postal_code,
            updated_at: new Date().toISOString(),
          },
        })
  
        res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' })
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: utils.errorMessage })
    }
  }
  
  async deleteClient(req, res) {
    try {
      const clientId = req.params.id
  
      const client = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      })
  
      if (client) {
        await prisma.clientAddress.deleteMany({
          where: {
            client_id: clientId,
          },
        })
        
        await prisma.client.delete({
          where: {
            id: clientId,
          },
        })
  
        res.status(200).json({ message: 'Cliente deletado com sucesso!' })
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' })
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: utils.errorMessage })
    }
  }
}

module.exports = ClientController
