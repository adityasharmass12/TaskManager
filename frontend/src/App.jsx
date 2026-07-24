import { useState, useEffect, useCallback } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const loadTasks = useCallback(async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchTasks(search);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async (taskData) => {
    const res = await createTask(taskData);
    setTasks((prev) => [res.data, ...prev]);
  };

  const handleUpdate = async (id, data) => {
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const handleStatusChange = async (id, status) => {
    const res = await patchTaskStatus(id, status);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
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
