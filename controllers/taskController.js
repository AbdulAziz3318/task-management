const mongoose = require('mongoose')
const Task = require('../models/Task')

const allowedStatuses = [
  'pending',
  'in-progress',
  'completed',
]

const allowedFields = ['title', 'description', 'status']


const validateTaskInput = (body, isUpdate = false) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object'
  }

  const keys = Object.keys(body)

  if (keys.some(key => !allowedFields.includes(key))) {
    return 'Request contains unsupported fields'
  }

  if (isUpdate && keys.length === 0) {
    return 'Provide at least one field to update'
  }

  if (Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (
      typeof body.title !== 'string' ||
      !body.title.trim() ||
      body.title.trim().length > 150
    ) {
      return 'Title must contain 1 to 150 characters'
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    if (
      typeof body.description !== 'string' ||
      body.description.length > 2000
    ) {
      return 'Description must be a string of at most 2000 characters'
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'status')) {
    if (!allowedStatuses.includes(body.status)) {
      return 'Status must be pending, in-progress, or completed'
    }
  }

  return null
}


const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body)

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      })
    }

    const { title, description, status } = req.body

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        message: 'Task title is required',
      })
    }

    const task = await Task.create({
      title: title.trim(),
      ...(description !== undefined
        ? { description: description.trim() }
        : {}),
      ...(status !== undefined ? { status } : {}),
      user: req.user.id,
    })

    return res.status(201).json({
      message: 'Task created successfully',
      task,
    })
  } catch (error) {
    next(error)
  }
}


const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      count: tasks.length,
      tasks,
    })
  } catch (error) {
    next(error)
  }
}


const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user.id,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    return res.status(200).json({
      task,
    })
  } catch (error) {
    next(error)
  }
}


const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const validationError = validateTaskInput(req.body, true)

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      })
    }

    const updates = {}

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] =
          field === 'title' || field === 'description'
            ? req.body[field].trim()
            : req.body[field]
      }
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    return res.status(200).json({
      message: 'Task updated successfully',
      task,
    })
  } catch (error) {
    next(error)
  }
}


const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
}