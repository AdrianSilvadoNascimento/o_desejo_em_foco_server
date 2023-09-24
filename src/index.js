const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()
const { env } = require('process')

const movementationRoutes = require('./routes/movementations-routes')
const itemsRoutes = require('./routes/items-routes')
const userRoutes = require('./routes/user-routes')

const PORT = env.PORT
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/movementation', movementationRoutes)
app.use('/user', userRoutes)
app.use('/', itemsRoutes)

app.listen(PORT, () => {
  console.log(`A aplicação está rodando na porta ${PORT}`)
})
