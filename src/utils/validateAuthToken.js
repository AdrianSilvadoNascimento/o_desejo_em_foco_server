const jwt = require('jsonwebtoken')
const { env } = require('process')

class ValidateAuthToken {
  validateToken(req, res, next) {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido'})
    }

    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Formato de token inválido' })
    }

    const tokenJWT = token.substring(7)

    try {
      const decoded = jwt.verify(tokenJWT, env.SECRET_MESSAGE)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' })
    }
  }
}

module.exports = ValidateAuthToken
