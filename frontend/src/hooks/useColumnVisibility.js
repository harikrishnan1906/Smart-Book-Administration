import { useState, useEffect } from "react";

const useColumnVisibility = (storageKey, defaultColumns) => {
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaultColumns to ensure new columns are picked up if added later
        return { ...defaultColumns, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse column visibility from localStorage", e);
    }
    return defaultColumns;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
  }, [visibleColumns, storageKey]);

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  return [visibleColumns, toggleColumn, setVisibleColumns];
};

export default useColumnVisibility;
