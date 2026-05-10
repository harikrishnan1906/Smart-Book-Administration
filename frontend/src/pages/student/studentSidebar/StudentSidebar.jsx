import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import "./StudentSidebar.css";

function StudentSidebar() {
  const { role, logoutUser } = useContext(DataContext);
  const navigate = useNavigate();

  const basePath = role === 'staff' ? '/staff' : '/student';

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser();
    navigate('/');
  };

  return (
    <aside className="student-sidebar">
      <nav className="sidebar-nav">
        <NavLink to={basePath} end>
          Dashboard
        </NavLink>

        <NavLink to={`${basePath}/books`}>Browse Books</NavLink>

        <NavLink to={`${basePath}/issued`}>Issued Books</NavLink>

        <NavLink to={`${basePath}/requests`}>My Requests</NavLink>

        <NavLink to={`${basePath}/profile`}>Profile</NavLink>

        <a href="/" onClick={handleLogout} className="logout-link">
          Logout
        </a>
      </nav>
    </aside>
  );
}

export default StudentSidebar;
