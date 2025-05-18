const jsonServer = require('json-server')
const path = require('path')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({ static: './assets' })
const PORT = process.env.PORT || 3000

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Endpoint: /promo → jogos com desconto
server.get('/promo', (req, res) => {
  const db = router.db.get('games').value()
  const promoGames = db.filter((game) => game.prices.discount !== null)
  res.jsonp(promoGames)
})

// Endpoint: /comingsoon → jogos com prices.current === null
server.get('/comingsoon', (req, res) => {
  const db = router.db.get('games').value()
  const comingSoonGames = db.filter((game) => game.prices.current === null)
  res.jsonp(comingSoonGames)
})

// Endpoint: /highlight → retorna um game aleatório
server.get('/highlight', (req, res) => {
  const db = router.db.get('games').value()
  const random = db[Math.floor(Math.random() * db.length)]
  res.jsonp(random)
})

// Endpoint: /action → "action" ou "adventure" na category
server.get('/action', (req, res) => {
  const db = router.db.get('games').value()
  const result = db.filter((game) => {
    const category = game.details.category.toLowerCase()
    return category.includes('action') || category.includes('adventure')
  })
  res.jsonp(result)
})

// Endpoint: /rpg
server.get('/rpg', (req, res) => {
  const db = router.db.get('games').value()
  const result = db.filter((game) =>
    game.details.category.toLowerCase().includes('rpg')
  )
  res.jsonp(result)
})

// Endpoint: /horror
server.get('/horror', (req, res) => {
  const db = router.db.get('games').value()
  const result = db.filter((game) =>
    game.details.category.toLowerCase().includes('horror')
  )
  res.jsonp(result)
})

// Endpoint: /fps
server.get('/fps', (req, res) => {
  const db = router.db.get('games').value()
  const result = db.filter((game) =>
    game.details.category.toLowerCase() === 'fps'
  )
  res.jsonp(result)
})

// Endpoint: /sports
server.get('/sports', (req, res) => {
  const db = router.db.get('games').value()
  const result = db.filter((game) =>
    game.details.category.toLowerCase() === 'sports'
  )
  res.jsonp(result)
})

// Endpoint: /sim
server.get('/sim', (req, res) => {
  const db = router.db.get('games').value()
  const result = db.filter((game) =>
    game.details.category.toLowerCase() === 'simulator'
  )
  res.jsonp(result)
})

server.use(router)
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
