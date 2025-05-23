const express = require('express')
const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(middlewares)

app.use('/assets', express.static(path.join(__dirname, 'src/assets')))
app.use('/eplay/assets', express.static(path.join(__dirname, 'src/assets/eplay')))

const dbEplayPath = path.join(__dirname, 'src/mocks/eplay/db.json')

// Carregar banco de dados da EPLAY
const dbEplay = JSON.parse(fs.readFileSync(dbEplayPath, 'utf-8'))

// -------------------- EPLAY ENDPOINTS --------------------

app.get('/eplay/highlight', (req, res) => {
  const games = dbEplay.games
  const randomGame = games[Math.floor(Math.random() * games.length)]
  res.json(randomGame)
})

app.get('/eplay/comingsoon', (req, res) => {
  const filtered = dbEplay.games.filter((g) => g.prices.current === null)
  res.json(filtered)
})

app.get('/eplay/onsale', (req, res) => {
  const filtered = dbEplay.games.filter((g) =>
    g.prices.old !== null && g.prices.current !== null
  )
  res.json(filtered)
})

app.get('/eplay/action', (req, res) => {
  const filtered = dbEplay.games.filter((g) => {
    const cat = g.details?.category?.toLowerCase() || ''
    return cat.includes('action') || cat.includes('adventure')
  })
  res.json(filtered)
})

app.get('/eplay/rpg', (req, res) => {
  const filtered = dbEplay.games.filter((g) => {
    const cat = g.details?.category?.toLowerCase() || ''
    return cat.includes('rpg') || cat.includes('soulslike')
  })
  res.json(filtered)
})

app.get('/eplay/horror', (req, res) => {
  const filtered = dbEplay.games.filter((g) =>
    g.details?.category?.toLowerCase().includes('horror')
  )
  res.json(filtered)
})

app.get('/eplay/fps', (req, res) => {
  const filtered = dbEplay.games.filter((g) =>
    g.details?.category?.toLowerCase() === 'fps'
  )
  res.json(filtered)
})

app.get('/eplay/sports', (req, res) => {
  const filtered = dbEplay.games.filter((g) =>
    g.details?.category?.toLowerCase() === 'sports'
  )
  res.json(filtered)
})

app.get('/eplay/sim', (req, res) => {
  const filtered = dbEplay.games.filter((g) =>
    g.details?.category?.toLowerCase() === 'simulation'
  )
  res.json(filtered)
})

app.get('/eplay/puzzle', (req, res) => {
  const filtered = dbEplay.games.filter((g) =>
    g.details?.category?.toLowerCase().includes('puzzle')
  )
  res.json(filtered)
})

app.get('/eplay/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase().replace(/-/g, ' ')
  const filtered = dbEplay.games.filter((g) =>
    g.name.toLowerCase().includes(query)
  )
  res.json(filtered)
})

app.get('/eplay/checkout', (req, res) => {
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

app.post('/eplay/checkout', (req, res) => {
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

// --------------------------------------------------------

const eplayRouter = jsonServer.router(dbEplay)
app.use('/eplay', eplayRouter)

app.listen(port, () => {
  console.log(`Fake API is running on http://localhost:${port}`)
})
