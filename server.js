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

module.exports = server;
