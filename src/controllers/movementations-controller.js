const { PrismaClient } = require('@prisma/client')
const utils = require('../utils/utils')

const prisma = new PrismaClient()

const move_type = {
  entrada: 'Entrada',
}

class MovementationController {
  async movementations(req, res) {
    try {
      const userId = req.params.id
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
  
      if (user) {
        const movementations = await prisma.movementation.findMany({
          where: {
            user_id: user.id,
          },
          include: {
            user: true,
            item: true,
            employee: true,
          },
        })
        res.status(200).json(movementations)
      } else {
        res.status(404).json({ message: 'Estabelecimento não encontrado' })
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: utils.errorMessage })
    }
  }
  
  async move(req, res) {
    try {
      const body = req.body
      const itemId = body.itemId
      const userId = body.userId
  
      if (!itemId || !userId) {
        return res.status(401).json({ message: 'ID do usuário ou do item inválido' })
      } else {
        const employer = await prisma.user.findUnique({
          where: {
            id: userId,
          }
        })
  
        const employee = await prisma.employee.findUnique({
          where: {
            id: userId,
          }
        })
  
        const item = await prisma.item.findUnique({
          where: {
            id: itemId,
          }
        })
  
        let newQuantity = 0
        if (body.move_type != move_type.entrada) {
          if (body.quantity > item.quantity) {
            return res.status(401).json({ message: 'A quantidade do item em estoque é inferior ao solicitado' })
          } else {
            newQuantity = item.quantity - body.quantity
          }
        } else {
          newQuantity = item.quantity + body.quantity
        }
  
        await prisma.item.update({
          where: {
            id: itemId,
          },
          data: {
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          }
        })
        
        if ((employer || employee) && item) {
          await prisma.item.update({
            where: {
              id: item.id,
            },
            data: {
              movementations: {
                create: {
                  move_type: body.move_type,
                  user_id: employer ? employer.id : employee.id,
                  quantity: body.quantity,
                  employee_id: employee?.id,
                  updated_at: new Date().toISOString(),
                }
              }
            }
          })
  
          res.status(200).json({ message: 'Movimentação feita com sucesso' })
        }
      }
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ message: utils.errorMessage })
    }
  }
  
  async deleteMovementation(req, res) {
    try {
      const movementationId = req.params.id
      const movementation = await prisma.movementation.findUnique({
        where: {
          id: movementationId,
        },
      })
  
      if (!movementation) {
        res.status(404).json({ message: 'Movimentação não encontrada' })
      } else {
        const itemReference = await prisma.item.findUnique({
          where: {
            id: movementation.item_id,
          },
        })
  
        if (itemReference) {
          const newQuantity = movementation.move_type != move_type.entrada ? itemReference.quantity + movementation.quantity : itemReference.quantity - movementation.quantity
          
          await prisma.item.update({
            where: {
              id: movementation.item_id,
            },
            data: {
              quantity: newQuantity,
            },
          })
          
          await prisma.movementation.delete({
            where: {
              id: movementationId,
            },
          })
  
          res.status(200).json({ message: 'Movimentação deletada com sucesso' })
        }
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: utils.errorMessage })
    }
  }
}

module.exports = MovementationController
