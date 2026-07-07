const blogRouter = require("./blogs")
const userRouter = require("./users")
const loginRouter = require("./login")
const authorRouter = require("./authors")
const readingListRouter = require("./reading_lists")

module.exports = {
  blogRouter,
  userRouter,
  loginRouter,
  authorRouter,
  readingListRouter
}