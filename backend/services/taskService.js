const Task = require('../models/Task');

function buildSearchFilter(search) {
  if (!search) {
    return {};
  }

  return {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ],
  };
}

async function getTasks(search) {
  const filter = buildSearchFilter(search);
  return Task.find(filter).sort({ createdAt: -1 });
}

async function createTask(data) {
  return Task.create(data);
}

async function updateTask(id, data) {
  return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function updateTaskStatus(id, status) {
  return Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
}

async function deleteTask(id) {
  return Task.findByIdAndDelete(id);
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};