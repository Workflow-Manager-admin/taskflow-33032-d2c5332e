import React from "react";
import TaskCard from "./TaskCard";

// PUBLIC_INTERFACE
function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  /** List of task cards, optionally filtered by category/project */
  return (
    <div className="task-list">
      {tasks.length === 0 && (
        <div className="empty-state">No tasks in this category. ✨</div>
      )}
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          onToggleStatus={() => onToggleStatus(task.id)}
        />
      ))}
    </div>
  );
}

export default TaskList;
