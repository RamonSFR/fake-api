const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const path = require('path')

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Servir arquivos da pasta /assets
server.use('/assets', jsonServer.static(path.join(__dirname, 'assets')))

// Endpoint personalizado: /promo
server.get('/promo', (req, res) => {
  const games = router.db.get('games').value()
  const promoGames = games.filter((game) => game.prices.discount !== null)
  res.json(promoGames)
})

// Endpoint personalizado: /comingsoon
server.get('/comingsoon', (req, res) => {
  const games = router.db.get('games').value()
  const comingSoonGames = games.filter((game) => game.prices.current === null)
  res.json(comingSoonGames)
})

// Endpoint personalizado: /highlight
server.get('/highlight', (req, res) => {
  const games = router.db.get('games').value()
  const random = games[Math.floor(Math.random() * games.length)]
  res.json(random)
})

// Filtros por categoria
server.get('/action', (req, res) => {
  const games = router.db.get('games').value()
  const filtered = games.filter((game) =>
    game.details.category.toLowerCase().includes('action') ||
    game.details.category.toLowerCase().includes('adventure')
  )
  res.json(filtered)
})

server.get('/rpg', (req, res) => {
  const games = router.db.get('games').value()
  const filtered = games.filter((game) =>
    game.details.category.toLowerCase().includes('rpg')
  )
  res.json(filtered)
})

server.get('/horror', (req, res) => {
  const games = router.db.get('games').value()
  const filtered = games.filter((game) =>
    game.details.category.toLowerCase().includes('horror')
  )
  res.json(filtered)
})

server.get('/fps', (req, res) => {
  const games = router.db.get('games').value()
  const filtered = games.filter((game) =>
    game.details.category.toLowerCase() === 'fps'
  )
  res.json(filtered)
})

server.get('/sports', (req, res) => {
  const games = router.db.get('games').value()
  const filtered = games.filter((game) =>
    game.details.category.toLowerCase() === 'sports'
  )
  res.json(filtered)
})

server.get('/sim', (req, res) => {
  const games = router.db.get('games').value()
  const filtered = games.filter((game) =>
    game.details.category.toLowerCase().includes('simulator')
  )
  res.json(filtered)
})

// Rota padrão do json-server
server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})
