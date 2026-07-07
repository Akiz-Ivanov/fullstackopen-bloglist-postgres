const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')

router.post('/', async (req, res) => {
  const user = await User.findByPk(req.body.userId)
  const blog = await Blog.findByPk(req.body.blogId)

  if (!user) {
    return res.status(404).json({ error: "user not found" })
  }

  if (!blog) {
    return res.status(404).json({ error: "blog not found" })
  }

  const readingList = await ReadingList.create({ userId: user.id, blogId: blog.id })
  res.json(readingList)
})

module.exports = router