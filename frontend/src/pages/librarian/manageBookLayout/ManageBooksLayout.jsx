import React from "react";
import "./ManageBooksLayout.css";
import { Outlet, NavLink } from "react-router-dom";

const ManageBooksLayout = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h4 style={{ color: "var(--darkerTextColor)", fontWeight: 600 }}>
          Manage Books
        </h4>
        <p style={{ fontSize: "14px", color: "var(--darkTextColor)" }}>
          Add, delete, and search books
        </p>
      </div>

      {/* Sub Navigation */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <NavLink to="search" className="nav-link">
            <i className="fa-solid fa-magnifying-glass"></i> Search Books
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="add" className="nav-link">
            <i className="fa-solid fa-plus"></i> Add Books
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="delete" className="nav-link">
            <i className="fa-solid fa-x"></i> Delete Books
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="deleted" className="nav-link">
            <i className="fa-solid fa-trash-arrow-up"></i> Damaged Books
          </NavLink>
        </li>
      </ul>

      {/* Renders sub-components */}
      <Outlet />
    </div>
  );
};

export default ManageBooksLayout;
