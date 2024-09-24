import React from "react";
import "./Header.css"; // Ensure this file exists

const Header = ({ setGroupBy, setSortBy }) => {
  // Get initial values from localStorage for groupBy and sortBy
  const initialGroupBy = localStorage.getItem("groupBy") || "status";
  const initialSortBy = localStorage.getItem("sortBy") || "priority";

  return (
    <div className="header-container">
      <div className="display-options">
        <button className="display-button">
          <span className="icon">≡</span> Display ▼
        </button>
        <div className="dropdown-menu">
          <div className="grouping-options">
            <label>Grouping</label>
            {/* Set the value of the select to the current groupBy state */}
            <select
              value={initialGroupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="sorting-options">
            <label>Ordering</label>
            {/* Set the value of the select to the current sortBy state */}
            <select
              value={initialSortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
