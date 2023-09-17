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
    const items = await prisma.item.findMany()

    if (!items.length) {
      return res.status(401).json({ message: 'Não há items para enviar' })
    } else {
      res.status(200).json(items)
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const registerItem = async (req, res) => {
  try {
    if (!req.body) {
      res.status(401).json({ message: 'Sem dados para salvar' })
    }
    
    const item = await prisma.item.create({
      data: req.body
    })

    res.status(200).json(item)
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
