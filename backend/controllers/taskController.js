const taskService = require('../services/taskService');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getTasks = async (req, res) => {
  try {
    const { search } = req.query;
    const tasks = await taskService.getAllTasks(search);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const getTask = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    const task = await taskService.createTask({ title: title.trim(), description });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const { title } = req.body;
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const patchStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const { status } = req.body;
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending or completed' });
    }
    const task = await taskService.updateTaskStatus(req.params.id, status);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

const removeTask = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const task = await taskService.deleteTask(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, patchStatus, removeTask };
