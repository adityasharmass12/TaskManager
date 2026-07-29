import { useEffect, useState } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  patchTaskStatus,
  deleteTask,
} from './api/taskApi';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async (search = '') => {
    console.log('Loading tasks for search:', search);
    setLoading(true);
    setError('');

    try {
      const res = await fetchTasks(search);
      console.log('Tasks loaded count:', res.data.length);
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('App mounted');
    loadTasks();
  }, []);

  const handleAdd = async (taskData) => {
    console.log('Submitting new task:', taskData);
    const res = await createTask(taskData);
    console.log('Task added:', res.data._id);
    setTasks((prev) => [res.data, ...prev]);
  };

  const handleUpdate = async (id, data) => {
    console.log('Updating task from UI:', id, data);
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const handleStatusChange = async (id, status) => {
    console.log('Changing task status:', id, status);
    const res = await patchTaskStatus(id, status);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    console.log('Deleting task from UI:', id);
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleSearch = (query) => {
    console.log('Searching tasks:', query);
    loadTasks(query);
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <div className="stats">
          <span className="stat pending">{pendingCount} pending</span>
          <span className="stat completed">{completedCount} completed</span>
        </div>
      </header>
      <main className="app-main">
        <TaskForm onAdd={handleAdd} />
        <SearchBar onSearch={handleSearch} />
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onUpdate={handleUpdate}
        />
      </main>
    </div>
  );
}

export default App;
