// JSON Server module
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");

// Middleware para servir arquivos estáticos da pasta /assets
server.use(
  "/assets",
  jsonServer.defaults({ static: path.join(__dirname, "assets") })
);

// Middlewares padrões
const middlewares = jsonServer.defaults();
server.use(middlewares);

// Reescritor de rotas
server.use(
  jsonServer.rewriter({
    "/*": "/$1"
  })
);

// Usa o roteador JSON
server.use(router);

// Inicia o servidor
server.listen(3000, () => {
  console.log("JSON Server is running");
});

server.get("/promo", (req, res) => {
  const db = router.db
  const games = db.get("games").value()
  const promoGames = games.filter(
    (game) => game.prices.current !== null && game.prices.discount !== null
  )
  res.json(promoGames)
})

server.get("/comingsoon", (req, res) => {
  const db = router.db
  const games = db.get("games").value()
  const comingSoonGames = games.filter((game) => game.prices.current === null)
  res.json(comingSoonGames)
})

module.exports = server;
