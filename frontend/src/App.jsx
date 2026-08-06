import { useEffect, useState } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL || '/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [message, setMessage] = useState('')

  // load tasks from backend
  async function loadTasks(query = '') {
    try {
      setLoading(true)
      let url = API
      if (query) url = `${API}?search=${encodeURIComponent(query)}`

      const res = await fetch(url)
      if (!res.ok) throw new Error('Could not load tasks')

      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setMessage(err.message || 'Could not load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [])

  // add a new task
  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a task title')
      return
    }

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Could not add task')
      }

      const newTask = await res.json()
      setTasks(prev => [newTask, ...prev])
      setTitle('')
      setDescription('')
      setMessage('')
    } catch (err) {
      setMessage(err.message || 'Could not add task')
    }
  }

  // save edited task
  const saveTask = async (taskId) => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty')
      return
    }

    try {
      const res = await fetch(`${API}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim(), description: editDescription.trim() })
      })
      if (!res.ok) throw new Error('Could not update task')

      const updated = await res.json()
      setTasks(prev => prev.map(t => t._id === taskId ? updated : t))
      setEditingId('')
      setEditTitle('')
      setEditDescription('')
      setMessage('')
    } catch (err) {
      setMessage(err.message || 'Could not update task')
    }
  }

  // toggle completed/pending
  async function toggleStatus(task) {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    try {
      const res = await fetch(`${API}/${task._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Could not update status')

      const updated = await res.json()
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t))
    } catch (err) {
      setMessage(err.message || 'Could not update status')
    }
  }

  function handleDelete(taskId) {
    if (!window.confirm('Delete this task?')) return

    fetch(`${API}/${taskId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Could not delete task')
        setTasks(prev => prev.filter(t => t._id !== taskId))
      })
      .catch(err => {
        setMessage(err.message || 'Could not delete task')
      })
  }

  function startEdit(task) {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

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
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Task description"
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              onChange={e => setSearch(e.target.value)}
            />
            <button type="button" onClick={() => loadTasks(search)}>Search</button>
            <button type="button" className="secondary" onClick={() => {
              setSearch('')
              loadTasks('')
            }}>Reset</button>
          </div>
        </section>

        {message && <div className="notice">{message}</div>}

        <section className="card">
          <h2>Tasks</h2>

          {loading && <p className="state">Loading tasks...</p>}
          {!loading && tasks.length === 0 && <p className="state">No tasks yet.</p>}

          <div className="list">
            {tasks.map(task => {
              if (editingId === task._id) {
                return (
                  <article className={`task ${task.status}`} key={task._id}>
                    <div className="editBox">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                      />
                      <textarea
                        rows="3"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                      />
                      <div className="rowButtons">
                        <button type="button" onClick={() => saveTask(task._id)}>Save</button>
                        <button type="button" className="secondary" onClick={() => setEditingId('')}>Cancel</button>
                      </div>
                    </div>
                  </article>
                )
              }

              return (
                <article className={`task ${task.status}`} key={task._id}>
                  <div className="taskText">
                    <div className="taskTop">
                      <h3>{task.title}</h3>
                      <span className="tag">{task.status}</span>
                    </div>
                    {task.description && <p>{task.description}</p>}
                    <small>{formatDate(task.createdAt)}</small>
                  </div>
                  <div className="rowButtons">
                    <button type="button" onClick={() => toggleStatus(task)}>
                      {task.status === 'pending' ? 'Done' : 'Undo'}
                    </button>
                    <button type="button" className="secondary" onClick={() => startEdit(task)}>Edit</button>
                    <button type="button" className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
