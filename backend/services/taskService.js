const Task = require('../models/Task');

const getAllTasks = (searchQuery) => {
  const filter = searchQuery
    ? {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};

  console.log('Task query filter:', filter);
  return Task.find(filter).sort({ createdAt: -1 });
};

const getTaskById = (id) => Task.findById(id);

const createTask = async (data) => {
  console.log('Saving task payload:', data);
  const task = new Task(data);
  return task.save();
};

const updateTask = (id, data) => {
  console.log('Applying task update:', id, data);
  return Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const updateTaskStatus = (id, status) => {
  console.log('Applying task status update:', id, status);
  return Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

const deleteTask = (id) => {
  console.log('Removing task from database:', id);
  return Task.findByIdAndDelete(id);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
