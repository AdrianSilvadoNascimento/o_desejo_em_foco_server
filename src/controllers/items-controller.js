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
      console.log('Pegando itens através do master')
      const items = await prisma.item.findMany({
        where: {
          user_id: user.id,
        },
      })

      res.status(200).json(items)
    } else {
      console.log('Pegando itens através do funcionário')
      const employee = await prisma.employee.findUnique({
        where: {
          id: userId,
        },
      })

      if (employee) {
        const items = await prisma.item.findMany({
          where: {
            user_id: employee.user_id,
          },
        })

        res.status(200).json(items)
      }
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const registerItem = async (req, res) => {
  try {
    const body = req.body
    const user = await prisma.user.findUnique({
      where: {
        id: body.userId,
      }
    })

    if (user) {
      await prisma.user.update({
        where: {
          id: body.userId,
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
    } else {
      const employee = await prisma.employee.findUnique({
        where: {
          id: body.userId,
        }
      })

      if (employee) {
        await prisma.user.update({
          where: {
            id: employee.user_id,
          },
          data: {
            item: {
              create: {
                name: body.name,
                category: body.category,
                product_image: body.product_image,
                quantity: body.quantity,
                unit_price: body.unit_price,
                employee_id: employee.id,
              },
            },
          },
        })

        res.status(200).json({ message: "Novo produto adicionado com sucesso!" })
      }
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
      }
    })

    if (!item) {
      res.status(404).json({ message: 'Item não encontrado' })
    } else {
      await prisma.item.delete({
        where: {
          id: req.params.id,
        }
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
