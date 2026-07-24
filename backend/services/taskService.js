const Task = require('../models/Task');

const getAllTasks = async (searchQuery) => {
  let filter = {};
  if (searchQuery) {
    filter = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    };
  }
  return await Task.find(filter).sort({ createdAt: -1 });
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const createTask = async (data) => {
  const task = new Task(data);
  return await task.save();
};

const updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const updateTaskStatus = async (id, status) => {
  return await Task.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
