const { PrismaClient } = require('@prisma/client')
const utils = require('../utils/utils')

const prisma = new PrismaClient()

const move_type = {
  entrada: 'Entrada',
}

const move = async (req, res) => {
  try {
    const body = req.body
    const itemId = body.itemId
    const userId = body.userId

    if (!itemId && !userId) {
      return res.status(401).json({ message: 'ID do usuário ou do item inválido' })
    } else {
      const user = await prisma.user.findUnique({
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
          return res.status(401).json({ message: 'A Quantidade do item é inferior ao solicitado' })
        } else {
          newQuantity = item.quantity - body.quantity
        }
      } else {
        newQuantity = item.quantity + body.quantity
      }

      const updatedItem = await prisma.item.update({
        where: {
          id: itemId,
        },
        data: {
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        }
      })
      
      if (user && item) {
        const newMovementation = await prisma.movementation.create({
          data: {
            move_type: body.move_type,
            item_id: itemId,
            user_id: userId,
            quantity: newQuantity,
          }
        })

        res.status(200).json({ message: 'Movimentação feita com sucesso', newMovementation })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: utils.errorMessage })
  }
}

module.exports = {
  move,
}
