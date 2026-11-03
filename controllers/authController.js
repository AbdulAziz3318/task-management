const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const isValidEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Register a new user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        message: 'Enter a valid name',
      })
    }

    if (
      typeof email !== 'string' ||
      !isValidEmail(email.trim()) ||
      email.trim().length > 254
    ) {
      return res.status(400).json({
        message: 'Enter a valid email address',
      })
    }

    if (
      typeof password !== 'string' ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message: 'Password must contain 8 to 128 characters',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Log in an existing user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      !isValidEmail(email.trim()) ||
      typeof password !== 'string' ||
      !password.length ||
      password.length > 128
    ) {
      return res.status(400).json({
        message: 'Enter a valid email and password',
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    )

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    )

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}