const jsonServer = require('json-server')
const express = require('express')
const path = require('path')
const cors = require('cors')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))

server.use(cors())
server.use(jsonServer.bodyParser)

// Correção para servir a pasta de imagens
server.use('/assets', express.static(path.join(__dirname, 'assets')))

// Endpoints customizados
server.get('/promo', (req, res) => {
  const db = router.db
  const games = db.get('games').filter(game => game.prices.discount != null).value()
  res.json(games)
})

server.get('/comingsoon', (req, res) => {
  const db = router.db
  const games = db.get('games').filter(game => game.prices.current == null).value()
  res.json(games)
})

server.get('/highlight', (req, res) => {
  const db = router.db
  const games = db.get('games').value()
  const randomGame = games[Math.floor(Math.random() * games.length)]
  res.json(randomGame)
})

// Endpoints por categoria
server.get('/action', (req, res) => {
  const db = router.db
  const games = db.get('games')
    .filter(game => {
      const category = game.details.category.toLowerCase()
      return category.includes('action') || category.includes('adventure')
    })
    .value()
  res.json(games)
})

server.get('/rpg', (req, res) => {
  const db = router.db
  const games = db.get('games')
    .filter(game => game.details.category.toLowerCase().includes('rpg'))
    .value()
  res.json(games)
})

server.get('/horror', (req, res) => {
  const db = router.db
  const games = db.get('games')
    .filter(game => game.details.category.toLowerCase().includes('horror'))
    .value()
  res.json(games)
})

server.get('/fps', (req, res) => {
  const db = router.db
  const games = db.get('games')
    .filter(game => game.details.category.toLowerCase() === 'fps')
    .value()
  res.json(games)
})

server.get('/sports', (req, res) => {
  const db = router.db
  const games = db.get('games')
    .filter(game => game.details.category.toLowerCase() === 'sports')
    .value()
  res.json(games)
})

server.get('/sim', (req, res) => {
  const db = router.db
  const games = db.get('games')
    .filter(game => game.details.category.toLowerCase() === 'simulator')
    .value()
  res.json(games)
})

// Usar o roteador padrão do json-server
server.use(router)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
