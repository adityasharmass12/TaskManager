const mongoose = require('mongoose');
const taskService = require('../services/taskService');

// fetch tasks
const getTasks = async (req, res) => {
  try {
    let searchQuery = req.query.search || '';
    const tasks = await taskService.getTasks(searchQuery);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Could not load tasks' });
  }
};

// create new task
const createTask = async (req, res) => {
  try {
    let title = (req.body.title || '').trim();
    let desc = (req.body.description || '').trim();

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await taskService.createTask({ title, description: desc });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Could not create task' });
  }
};

// update task details
function updateTask(req, res) {
  const id = req.params.id;
  const title = (req.body.title || '').trim();
  const desc = (req.body.description || '').trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  taskService.updateTask(id, { title, description: desc })
    .then(task => {
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    })
    .catch(() => {
      res.status(400).json({ message: 'Could not update task' });
    });
}

// toggle status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    if (status !== 'pending' && status !== 'completed') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await taskService.updateTaskStatus(id, status);
    if (!result) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: 'Could not update status' });
  }
};

// delete task
async function deleteTask(req, res) {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const deleted = await taskService.deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete task' });
  }
}

module.exports = { getTasks, createTask, updateTask, updateTaskStatus, deleteTask };