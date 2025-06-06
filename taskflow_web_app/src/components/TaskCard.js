import React from "react";

// PUBLIC_INTERFACE
function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  /** Card view for each task, shows title, status, and actions */
  const isOverdue =
    !task.completed && task.due &&
    new Date(task.due).setHours(23,59,59,999) < Date.now();

  return (
    <div className={`task-card${task.completed ? " completed" : ""}${isOverdue ? " overdue" : ""}`}>
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <div className="task-card-actions">
          <button className="task-card-btn" onClick={onEdit} title="Edit">&#9998;</button>
          <button className="task-card-btn" onClick={onDelete} title="Delete">&#128465;</button>
        </div>
      </div>
      <div className="task-card-desc">{task.description}</div>
      <div className="task-card-footer">
        {task.due && (
          <span className={`task-card-due${isOverdue ? " overdue" : ""}`}>
            Due: {new Date(task.due).toLocaleDateString()}
          </span>
        )}
        <button className="task-card-status-btn" onClick={onToggleStatus}>
          {task.completed ? "Completed" : task.inProgress ? "In Progress" : "Not Started"}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
