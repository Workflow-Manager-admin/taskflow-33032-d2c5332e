import React from "react";

// PUBLIC_INTERFACE
function Sidebar({ categories, selectedCategory, onSelectCategory, onAddCategory }) {
  /** Sidebar navigation for categories/projects */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Projects</h2>
        <button className="sidebar-add-btn" onClick={onAddCategory}>+</button>
      </div>
      <nav>
        <ul className="sidebar-category-list">
          {categories.map(category => (
            <li
              key={category.id}
              className={`sidebar-category-item${category.id === selectedCategory ? " selected" : ""}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <span className="sidebar-category-dot" style={{ background: category.color }}></span>
              {category.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
