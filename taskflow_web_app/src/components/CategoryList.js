import React from "react";

// PUBLIC_INTERFACE
function CategoryList({ categories, onSelect, selectedId }) {
  /** List of categories/projects for display in sidebar or elsewhere */
  return (
    <ul className="category-list">
      {categories.map(category => (
        <li
          key={category.id}
          className={`category-item${category.id === selectedId ? " selected" : ""}`}
          onClick={() => onSelect(category.id)}
        >
          <span className="category-dot" style={{ background: category.color }}></span>
          {category.name}
        </li>
      ))}
    </ul>
  );
}

export default CategoryList;
