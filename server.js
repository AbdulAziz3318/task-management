require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10kb' }))

// Health-check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Management API is running',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

// Centralized error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  // Invalid JSON request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON request body',
    })
  }

  // Duplicate email or another unique-index violation
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'A record with this unique value already exists',
    })
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    message: 'Internal server error',
  })
})

// Start the server after connecting to the database
const startServer = async () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error('MONGODB_URI and JWT_SECRET must be configured in .env')
    process.exit(1)
  }

  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()