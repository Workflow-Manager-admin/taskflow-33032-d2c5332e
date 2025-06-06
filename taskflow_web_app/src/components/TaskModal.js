import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function TaskModal({ open, onClose, onSave, initialTask, categories }) {
  /** Modal for creating or editing a new task */
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [due, setDue] = useState(initialTask?.due || "");
  const [categoryId, setCategoryId] = useState(initialTask?.categoryId || (categories[0]?.id || ""));

  useEffect(() => {
    setTitle(initialTask?.title || "");
    setDescription(initialTask?.description || "");
    setDue(initialTask?.due || "");
    setCategoryId(initialTask?.categoryId || (categories[0]?.id || ""));
  }, [initialTask, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...initialTask,
      title,
      description,
      due,
      categoryId,
    });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{initialTask ? "Edit Task" : "Create Task"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input required value={title} onChange={e => setTitle(e.target.value)} />
          </label>
          <label>
            Description
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <label>
            Due Date
            <input type="date" value={due} onChange={e => setDue(e.target.value)} />
          </label>
          <label>
            Category
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-accent">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
