import { useEffect, useState } from 'react';
import './App.css';

// In production we want to call the same origin so Vercel rewrites to the backend service.
// For local development you can set `VITE_API_URL` to "http://localhost:5000/api/tasks".
const API_URL = import.meta.env.VITE_API_URL || '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [message, setMessage] = useState('');

  const loadTasks = async (query = '') => {
    try {
      setLoading(true);
      const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Could not load tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setMessage(error.message || 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Could not add task');
      }

      const newTask = await response.json();
      setTasks((current) => [newTask, ...current]);
      setTitle('');
      setDescription('');
      setMessage('');
    } catch (error) {
      setMessage(error.message || 'Could not add task');
    }
  };

  const saveTask = async (taskId) => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Could not update task');
      }

      const updatedTask = await response.json();
      setTasks((current) => current.map((task) => (task._id === taskId ? updatedTask : task)));
      setEditingId('');
      setEditTitle('');
      setEditDescription('');
      setMessage('');
    } catch (error) {
      setMessage(error.message || 'Could not update task');
    }
  };

  const toggleStatus = async (task) => {
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending';

    try {
      const response = await fetch(`${API_URL}/${task._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Could not update status');
      }

      const updatedTask = await response.json();
      setTasks((current) => current.map((item) => (item._id === task._id ? updatedTask : item)));
    } catch (error) {
      setMessage(error.message || 'Could not update status');
    }
  };

  const deleteTask = async (taskId) => {
    const okay = window.confirm('Delete this task?');
    if (!okay) return;

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Could not delete task');
      }

      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (error) {
      setMessage(error.message || 'Could not delete task');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const visibleTasks = tasks;
  const pendingCount = visibleTasks.filter((task) => task.status === 'pending').length;
  const completedCount = visibleTasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="page">
      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">Simple Task Tracker</p>
            <h1>Keep track of small things.</h1>
            <p className="subtitle">A basic full stack task app made in a clean student style.</p>
          </div>

          <div className="stats">
            <span>{pendingCount} pending</span>
            <span>{completedCount} done</span>
          </div>
        </section>

        <section className="card">
          <h2>Add Task</h2>
          <form className="form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <textarea
              placeholder="Task description"
              rows="3"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </section>

        <section className="card">
          <h2>Search</h2>
          <div className="search-row">
            <input
              type="text"
              placeholder="Search tasks"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="button" onClick={() => loadTasks(search)}>
              Search
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setSearch('');
                loadTasks('');
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {message ? <div className="notice">{message}</div> : null}

        <section className="card">
          <h2>Tasks</h2>

          {loading ? <p className="state">Loading tasks...</p> : null}

          {!loading && visibleTasks.length === 0 ? <p className="state">No tasks yet.</p> : null}

          <div className="list">
            {visibleTasks.map((task) => {
              const isEditing = editingId === task._id;
              const dateText = task.createdAt
                ? new Date(task.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '';

              return (
                <article className={`task ${task.status}`} key={task._id}>
                  {isEditing ? (
                    <div className="editBox">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                      />
                      <textarea
                        rows="3"
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                      />
                      <div className="rowButtons">
                        <button type="button" onClick={() => saveTask(task._id)}>
                          Save
                        </button>
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => setEditingId('')}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="taskText">
                        <div className="taskTop">
                          <h3>{task.title}</h3>
                          <span className="tag">{task.status}</span>
                        </div>
                        {task.description ? <p>{task.description}</p> : null}
                        <small>{dateText}</small>
                      </div>

                      <div className="rowButtons">
                        <button type="button" onClick={() => toggleStatus(task)}>
                          {task.status === 'pending' ? 'Done' : 'Undo'}
                        </button>
                        <button type="button" className="secondary" onClick={() => startEdit(task)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deleteTask(task._id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
