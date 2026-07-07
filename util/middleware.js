const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Session, User } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      req.token = authorization.substring(7);
    } catch {
      return res.status(401).json({ error: "token invalid" })
    }
  } else {
    return res.status(401).json({ error: "token missing" })
  }
  next()
}

const sessionValidator = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        token: req.token
      },
    })

    if (!session) {
      return res.status(401).json({ error: "token invalid" })
    }

    const user = await User.findByPk(req.decodedToken.id)

    if (!user) {
      return res.status(401).json({ error: 'token invalid' })
    }

    if (user.disabled) {
      return res.status(401).json({ error: "token invalid" })
    }

    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  tokenExtractor,
  sessionValidator
}
