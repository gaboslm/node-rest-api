const z = require('zod')

const movieScheme = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title must be required'
  }).trim(),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url({
    message: 'Poster must be an url'
  }),
  genre: z.array(z.enum(['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy']), {
    required_error: 'Genre is required',
    invalid_type_error: 'Genre must be an array of enum Genre'
  })
})

function validateMovie (object) {
  return movieScheme.safeParse(object)
}

module.exports = {
  validateMovie
}
