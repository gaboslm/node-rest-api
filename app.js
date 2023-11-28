const express = require('express') // require -> commonJS
const cors = require('cors')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie } = require('./schemas/movies')

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'http://127.0.0.1:5500'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'), true)
  }
}))
app.disable('x-powered-by') // disable x-powered-by header

app.get('/', (req, res) => {
  res.json({ message: 'Hello world' })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query

  if (genre) {
    const data = movies.filter(
      (m) => m.genre.some((g) => g.toLowerCase().indexOf(genre.toLowerCase()) !== -1)
    )
    res.json(data)
  }

  res.json(movies)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(m => m.id === id)

  if (movieIndex !== -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)
})

app.get('/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id)

  if (!movie) res.json('Couldn\'t find movie')

  res.json(movie)
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
