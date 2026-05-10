import React, { useState, useRef, useEffect } from "react";
import "./ColumnToggle.css";

const ColumnToggle = ({ columns, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use human readable names (camelCase to Title Case)
  const formatLabel = (key) => {
    const result = key.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    // some manual fixes
    if (finalResult === "Accession No") return "Accession No";
    if (finalResult === "Serial No") return "Serial No";
    return finalResult;
  };

  return (
    <div className="column-toggle-container" ref={dropdownRef}>
      <button 
        className="btn btn-outline-secondary btn-sm dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <i className="fa-solid fa-table-columns me-2"></i>
        Columns <i className="fa-solid fa-chevron-down ms-1 small"></i>
      </button>

      {isOpen && (
        <div className="column-dropdown shadow-sm border rounded">
          <div className="p-2 dropdown-header-custom border-bottom bg-light">
            <small className="text-muted fw-bold text-uppercase">Toggle Columns</small>
          </div>
          <div className="dropdown-options">
            {Object.keys(columns).map((col) => {
              // Ensure we don't accidentally hide too much.
              // Optionally disable toggling if it's the only one left, but simple toggle is fine.
              return (
                <label key={col} className="dropdown-item-custom">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={columns[col]}
                    onChange={() => onToggle(col)}
                  />
                  <span>{formatLabel(col)}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnToggle;
