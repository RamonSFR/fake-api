const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Endpoint personalizado: /promo
server.get('/promo', (req, res) => {
  const db = router.db // lowdb instance
  const games = db.get('games').value()

  const promoGames = games.filter(
    (game) => game.prices?.discount !== null && game.prices?.discount !== undefined
  )

  res.jsonp(promoGames)
})

// Endpoint personalizado: /comingsoon
server.get('/comingsoon', (req, res) => {
  const db = router.db
  const games = db.get('games').value()

  const comingSoonGames = games.filter(
    (game) => game.prices?.current === null || game.prices?.current === undefined
  )

  res.jsonp(comingSoonGames)
})

// Rotas padrão (ex: /games)
server.use(router)

// Inicia o servidor
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
