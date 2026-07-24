import TaskItem from './TaskItem';

function TaskList({ tasks, loading, error, onDelete, onStatusChange, onUpdate }) {
  if (loading) {
    return <div className="loading-state">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="empty-state">No tasks found. Add one above!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;
