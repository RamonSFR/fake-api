const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

// Configurações
const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Importa o banco de dados JSON
const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'))

// Endpoints
app.get('/games', (req, res) => {
  res.json(db.games)
})

app.get('/games/:id', (req, res) => {
  const game = db.games.find((g) => g.id === parseInt(req.params.id))
  res.json(game || {})
})

// Filtros
app.get('/action', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.details.category.toLowerCase().includes('action') ||
    g.details.category.toLowerCase().includes('adventure')
  )
  res.json(filtered)
})

app.get('/rpg', (req, res) => {
  const filtered = db.games.filter((g) => {
    const cat = g.details.category.toLowerCase()
    return cat.includes('rpg') || cat.includes('soulslike')
  })
  res.json(filtered)
})

app.get('/horror', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.details.category.toLowerCase().includes('horror')
  )
  res.json(filtered)
})

app.get('/fps', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.details.category.toLowerCase() === 'fps'
  )
  res.json(filtered)
})

app.get('/sports', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.details.category.toLowerCase() === 'sports'
  )
  res.json(filtered)
})

app.get('/sim', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.details.category.toLowerCase() === 'simulator'
  )
  res.json(filtered)
})

// Checkout
function validate(body) {
  if (!body) return false

  let isValid = true
  try {
    if (body.payment.card.active) {
      isValid = body.payment.card.number.length > 0
    }
    if (body.products.length === 0) {
      isValid = false
    }
  } catch (e) {
    return false
  }
  return isValid
}

app.get('/checkout', (req, res) => {
  res.status(200).json({
    products: [{ id: 1, price: 0 }],
    billing: {
      name: 'string',
      email: 'string',
      document: 'string'
    },
    delivery: {
      email: 'string'
    },
    payment: {
      card: {
        active: true,
        owner: {
          name: 'string',
          document: 'string'
        },
        name: 'string',
        number: 'string',
        expires: {
          month: 12,
          year: 1234
        },
        code: 123
      },
      installments: 1
    }
  })
})

app.post('/checkout', (req, res) => {
  if (validate(req.body)) {
    const randomId = parseInt((Math.random() * 10000).toFixed(), 10)
    res.status(201).json({ orderId: `#100${randomId}` })
  } else {
    res.status(400).json({ message: 'Reveja os dados enviados' })
  }
})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
