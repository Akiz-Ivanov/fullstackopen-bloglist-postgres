const blogRouter = require("./blogs")
const userRouter = require("./users")
const loginRouter = require("./login")
const authorRouter = require("./authors")
const readingListRouter = require("./reading_lists")
const logoutRouter = require("./logout")

module.exports = {
  blogRouter,
  userRouter,
  loginRouter,
  authorRouter,
  readingListRouter,
  logoutRouter
}