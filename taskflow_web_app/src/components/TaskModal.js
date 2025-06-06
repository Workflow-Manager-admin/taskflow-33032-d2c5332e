import React, { useState, useEffect, useRef } from "react";

// PUBLIC_INTERFACE
function TaskModal({ open, onClose, onSave, initialTask, categories }) {
  /**
   * Modal for creating or editing a new task.
   * On opening for a new task, always resets fields to default/empty values.
   */
  // Track whether modal is opening as a new task (creation) or editing.
  const prevOpenRef = useRef(false);

  const getInitialFields = () => ({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    due: initialTask?.due || "",
    categoryId: initialTask?.categoryId || (categories[0]?.id || ""),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  // The logic: If opening for a new task (initialTask is FALSY), clear all fields.
  // On edit, use task's data.
  useEffect(() => {
    if (!open) {
      prevOpenRef.current = false;
      return;
    }
    // Modal is opening
    if (!prevOpenRef.current) {
      // Just transitioned from closed->open!
      if (!initialTask) {
        // "Create" mode, always clear ALL fields
        setTitle("");
        setDescription("");
        setDue("");
        setCategoryId(categories[0]?.id || "");
      } else {
        // "Edit" mode, prefill with existing task
        setTitle(initialTask.title || "");
        setDescription(initialTask.description || "");
        setDue(initialTask.due || "");
        setCategoryId(initialTask.categoryId || (categories[0]?.id || ""));
      }
    } else {
      // Already open, react to changes in task/category
      if (initialTask) {
        setTitle(initialTask.title || "");
        setDescription(initialTask.description || "");
        setDue(initialTask.due || "");
        setCategoryId(initialTask.categoryId || (categories[0]?.id || ""));
      }
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line
  }, [open, initialTask, categories]);

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
