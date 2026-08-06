const Task = require('../models/Task');

// get all tasks, optionally filtered by search
const getAllTasks = async (search) => {
  let query = {};
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };
  }
  const tasks = await Task.find(query).sort({ createdAt: -1 });
  return tasks;
};

const addTask = async (taskData) => {
  const task = await Task.create(taskData);
  return task;
};

async function editTask(id, data) {
  return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function changeStatus(id, status) {
  return await Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
}

async function removeTask(id) {
  return await Task.findByIdAndDelete(id);
}

module.exports = {
  getTasks: getAllTasks,
  createTask: addTask,
  updateTask: editTask,
  updateTaskStatus: changeStatus,
  deleteTask: removeTask
};