const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: { [Op.iLike]: `%${req.query.search}%` }
      },
      {
        author: { [Op.iLike]: `%${req.query.search}%` }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      return res.status(404).end()
    }
    next()
  } catch(error) {
    next(error)
  }
}

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  if (req.decodedToken.id !== req.blog.userId) {
    return res.status(403).json({ error: 'only the creator can delete a blog' })
  }
  try {
    await req.blog.destroy()
    res.status(204).end()
  } catch(error) {
    next(error)
  }
})

module.exports = router