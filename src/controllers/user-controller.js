const { PrismaClient } = require('@prisma/client')
const { env } = require('process')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const utils = require('../utils/utils')

const prisma = new PrismaClient()

const registerUser = async (req, res) => {
  try {
    const body = req?.body

    const newUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      }
    })
    
    if (!newUser) {
      const salt = await bcrypt.genSalt(10)
      body.password = await bcrypt.hash(body.password, salt)
      await prisma.user.create({
        data: body,
      })

      res.status(200).json({ message: 'Cadastrado com sucesso!' })
    } else {
      res.status(400).json({ message: 'Usuário já cadastrado!' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const registerEmployee = async (req, res) => {
  try {
    const body = req.body

    if (body.employerEmail && body.password) {
      const employer = await prisma.user.findUnique({
        where: {
          email: body.employerEmail,
        }
      })

      if (employer) {
        const salt = await bcrypt.genSalt(10)
        body.password = await bcrypt.hash(body.password, salt)
        
        await prisma.user.update({
          where: {
            email: body.employerEmail,
          },
          data: {
            employee: {
              create: {
                name: body.name,
                email: body.email,
                lastname: body.lastname,
                password: body.password,
                type: body.type,
              }
            }
          }
        })

        res.status(200).json({ message: "Funcionário registrado com sucesso!" })
      } else {
        res.status(404).json({ message: "Email da Loja não encontrado" })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: utils.errorMessage })
  }
}

const loginUser = async (req, res) => {
  try {
    const body = req.body
    const email = body.email
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      }
    })

    if (!user) {
      user = await prisma.employee.findUnique({
        where: {
          email: email,
        }
      })
    }

    if (user) {
      const invalidPassword = await bcrypt.compare(body.password, user.password)

      if (!invalidPassword) {
        res.status(401).json({ message: 'Senha inválida!' })
      } else {
        const token = jwt.sign(
          {
            user: user.name,
            email: user.email,
            userId: user.id,
          },
          env.SECRET_MESSAGE,
          {
            expiresIn: '1h',
          }
        )

        return res.status(200).json({
          token: token,
          userId: user.id,
          expiresIn: 3600,
          user: user.name,
        })
      }
    } else {
      res.status(401).json({ message: 'Credenciais Inválidas! Favor, tentar novamente' })
    }
  } catch (error) {
    res.status(500).json({ message: utils.errorMessage })
  }
}

module.exports = {
  registerEmployee,
  registerUser,
  loginUser,
}
