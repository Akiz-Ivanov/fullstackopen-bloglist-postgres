const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const { tokenExtractor, sessionValidator } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    if (!req.body.blogId) {
      return res.status(400).json({ error: "blogId is required" })
    }

    if (!req.body.userId) {
      return res.status(400).json({ error: "userId is required" })
    }

    const user = await User.findByPk(req.body.userId)
    const blog = await Blog.findByPk(req.body.blogId)

    if (!user) {
      return res.status(404).json({ error: "user not found" })
    }

    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    const readingList = await ReadingList.create({
      userId: req.body.userId,
      blogId: req.body.blogId,
    })

    res.json({
      id: readingList.id,
      blog_id: readingList.blogId,
      user_id: readingList.userId,
      read: readingList.read
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)

    if (!readingList) {
      return res.status(404).json({ error: 'reading list entry not found' })
    }

    if (req.decodedToken.id !== readingList.userId) {
      return res.status(401).json({ error: 'only the user who owns this reading list entry can update it' })
    }

    if (typeof req.body.read !== 'boolean') {
      return res.status(400).json({ error: 'read must be a boolean' })
    }

    readingList.read = req.body.read
    await readingList.save()

    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router