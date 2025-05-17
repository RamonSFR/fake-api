const express = require('express')
const path = require('path')
const jsonServer = require('json-server')
const fs = require('fs')

const server = express()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

// Serve a pasta 'assets' como estática
server.use('/assets', express.static(path.join(__dirname, 'assets')))

server.use(middlewares)

// Endpoints personalizados
server.get('/promo', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'))
  const promo = db.games.filter((game) => game.prices.discount != null)
  res.json(promo)
})

server.get('/comingsoon', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'))
  const comingSoon = db.games.filter((game) => game.prices.current == null)
  res.json(comingSoon)
})

// Rota padrão do JSON Server
server.use(router)

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`)
})
