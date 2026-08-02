const mongoose = require('mongoose');

const taskService = require('../services/taskService');

async function getTasks(req, res) {
  try {
    const search = req.query.search || '';
    const tasks = await taskService.getTasks(search);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Could not load tasks' });
  }
}

async function createTask(req, res) {
  try {
    const title = (req.body.title || '').trim();
    const description = (req.body.description || '').trim();

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await taskService.createTask({ title, description });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Could not create task' });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const title = (req.body.title || '').trim();
    const description = (req.body.description || '').trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await taskService.updateTask(id, { title, description });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Could not update task' });
  }
}

async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await taskService.updateTaskStatus(id, status);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Could not update status' });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await taskService.deleteTask(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete task' });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};