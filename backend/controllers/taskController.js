const taskService = require('../services/taskService');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getTasks = async (req, res) => {
  const { search } = req.query;
  console.log('Loading tasks with search:', search || '');

  try {
    const tasks = await taskService.getAllTasks(search);
    console.log('Tasks loaded:', tasks.length);
    return res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  console.log('Loading task:', id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Failed to fetch task:', error);
    return res.status(500).json({ message: 'Failed to fetch task' });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;
  console.log('Creating task:', req.body);

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title cannot be empty' });
  }

  try {
    const task = await taskService.createTask({
      title: title.trim(),
      description,
    });

    console.log('Task created:', task._id);
    return res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    return res.status(400).json({ message: error.message || 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  console.log('Updating task:', id, req.body);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ message: 'Title cannot be empty' });
  }

  try {
    const task = await taskService.updateTask(id, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task updated:', task._id);
    return res.json(task);
  } catch (error) {
    console.error('Failed to update task:', error);
    return res.status(400).json({ message: error.message || 'Failed to update task' });
  }
};

const patchStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log('Updating status:', id, status);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Status must be pending or completed' });
  }

  try {
    const task = await taskService.updateTaskStatus(id, status);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task status updated:', task._id, task.status);
    return res.json(task);
  } catch (error) {
    console.error('Failed to update status:', error);
    return res.status(500).json({ message: 'Failed to update status' });
  }
};

const removeTask = async (req, res) => {
  const { id } = req.params;
  console.log('Deleting task:', id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const task = await taskService.deleteTask(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task deleted:', id);
    return res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, patchStatus, removeTask };
