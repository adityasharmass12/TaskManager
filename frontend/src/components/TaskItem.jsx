import { useState } from 'react';

function TaskItem({ task, onDelete, onStatusChange, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [busy, setBusy] = useState(false);

  const handleToggleStatus = async () => {
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending';
    console.log('Toggling task status:', task._id, nextStatus);
    setBusy(true);

    try {
      await onStatusChange(task._id, nextStatus);
    } catch (error) {
      console.error('Failed to toggle status:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    console.log('Deleting task item:', task._id);
    setBusy(true);

    try {
      await onDelete(task._id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    const payload = { title: editTitle.trim(), description: editDesc.trim() };
    console.log('Saving task edit:', task._id, payload);
    setBusy(true);

    try {
      await onUpdate(task._id, payload);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save task edit:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleCancelEdit = () => {
    console.log('Canceling edit for task:', task._id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditing(false);
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`task-item ${task.status}`}>
      {editing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSaveEdit} disabled={busy}>
              Save
            </button>
            <button className="btn-cancel" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <div className="task-header">
              <h3 className={task.status === 'completed' ? 'done' : ''}>{task.title}</h3>
              <span className={`status-badge ${task.status}`}>{task.status}</span>
            </div>
            {task.description && <p className="task-desc">{task.description}</p>}
            <span className="task-date">{formattedDate}</span>
          </div>
          <div className="task-actions">
            <button
              className={`btn-status ${task.status}`}
              onClick={handleToggleStatus}
              disabled={busy}
            >
              {task.status === 'pending' ? 'Complete' : 'Undo'}
            </button>
            <button className="btn-edit" onClick={() => setEditing(true)} disabled={busy}>
              Edit
            </button>
            <button className="btn-delete" onClick={handleDelete} disabled={busy}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
