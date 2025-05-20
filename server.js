const express = require('express')
const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(middlewares)
app.use('/assets', express.static(path.join(__dirname, 'assets')))

const dbFile = path.join(__dirname, 'db.json')
const db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))

app.get('/highlight', (req, res) => {
  const db = router.db
  const games = db.get('games').value()
  const randomGame = games[Math.floor(Math.random() * games.length)]
  res.json(randomGame)
})

app.get('/comingsoon', (req, res) => {
  const filtered = db.games.filter((g) => g.prices.current === null)
  res.json(filtered)
})

app.get('/onsale', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.prices.old !== null && g.prices.current !== null
  )
  res.json(filtered)
})

app.get('/action', (req, res) => {
  const filtered = db.games.filter((g) => {
    const cat = g.details.category.toLowerCase()
    return cat.includes('action') || cat.includes('adventure')
  })
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
    g.details.category.toLowerCase() === 'simulation'
  )
  res.json(filtered)
})

app.get('/puzzle', (req, res) => {
  const filtered = db.games.filter((g) =>
    g.details.category.toLowerCase().includes('puzzle')
  )
  res.json(filtered)
})

app.get('/checkout', (req, res) => {
  const payload = {
    products: [
      {
        id: 1,
        price: 0
      }
    ],
    billing: {
      name: 'string',
      email: 'string',
      phone: 'string'
    },
    delivery: {
      address: 'string',
      zipCode: 'string',
      email: 'string'
    },
    payment: {
      card: {
        active: true,
        owner: {
          name: 'string'
        },
        name: 'string',
        number: 'string',
        expires: {
          month: 12,
          year: 2025
        },
        code: 123
      },
      installments: 1
    }
  }
  res.status(200).json(payload)
})

app.post('/checkout', (req, res) => {
  const body = req.body

  if (!body || !body.products || body.products.length === 0) {
    return res.status(400).json({ message: 'Reveja os dados enviados' })
  }

  if (body.payment.card.active) {
    const card = body.payment.card
    if (!card.number || !card.name || !card.expires || !card.code) {
      return res.status(400).json({ message: 'Dados do cartão incompletos' })
    }
  }

  const orderId = `#100${Math.floor(Math.random() * 10000)}`
  res.status(201).json({ orderId })
})

app.use(router)

app.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`)
})
