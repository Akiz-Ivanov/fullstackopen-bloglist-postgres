const Blog = require("./blog")
const User = require("./user")
const ReadingList = require("./reading_list")
const Session = require("./session")

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}
