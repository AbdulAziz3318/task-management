const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization

  if (
    typeof authorization !== 'string' ||
    !authorization.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      message: 'Authentication token is required',
    })
  }

  const token = authorization.slice(7).trim()

  if (!token) {
    return res.status(401).json({
      message: 'Authentication token is required',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (
      typeof decoded.userId !== 'string' ||
      !mongoose.isValidObjectId(decoded.userId)
    ) {
      return res.status(401).json({
        message: 'Invalid authentication token',
      })
    }

    req.user = {
      id: decoded.userId,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired authentication token',
    })
  }
}

module.exports = authMiddleware