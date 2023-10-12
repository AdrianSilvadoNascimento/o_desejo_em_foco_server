const { PrismaClient } = require('@prisma/client')
const utils = require('../utils/utils')

const prisma = new PrismaClient()

const getItem = async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: req.params.id,
      },
    })

    if (!item) {
      res.status(404).json({ message: 'Item não encontrado' })
    } else {
      res.status(200).json(item)
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const getItems = async (req, res) => {
  try {
    const userId = req.params.id
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    
    if (user) {
      const items = await prisma.item.findMany({
        where: {
          user_id: user.id,
        },
      })

      res.status(200).json(items)
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const registerItem = async (req, res) => {
  try {
    const body = req.body
    const userId = req.params.id
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    })

    if (user) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          item: {
            create: {
              name: body.name,
              category: body.category,
              product_image: body.product_image,
              quantity: body.quantity,
              unit_price: body.unit_price,
            },
          },
        },
      })

      res.status(200).json({ message: "Novo produto adicionado com sucesso!" })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const updateItem = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(401).json({ message: 'Sem dados para salvar' })
    }

    await prisma.item.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
        updated_at: new Date().toISOString(),
      }
    })

    res.status(200).json({ message: 'Item atualizado com sucesso' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const deleteItem = async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: req.params.id,
      },
    })

    if (!item) {
      res.status(404).json({ message: 'Item não encontrado' })
    } else {
      await prisma.movementation.deleteMany({
        where: { 
          item_id: item.id,
        },
      })
      
      await prisma.item.delete({
        where: {
          id: req.params.id,
        },
      })

      res.status(200).json({ message: 'Item deletado com sucesso' })
    } 
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

module.exports = {
  registerItem,
  updateItem,
  deleteItem,
  getItems,
  getItem,
}
