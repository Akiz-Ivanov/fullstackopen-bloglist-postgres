const express = require('express')
const app = express()
const { Blog, User, ReadingList } = require('./models')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const {
  blogRouter,
  userRouter,
  loginRouter,
  authorRouter,
  readingListRouter,
} = require("./controllers")

app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)

app.post('/api/reset', async (req, res) => {
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })
  await ReadingList.destroy({ where: {} })

  res.status(204).end()
})

app.get('/', (req, res) => {
  res.status(200).end()
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.errors.map(e => e.message) })
  }

  return response.status(400).json({ error: error.message })
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()