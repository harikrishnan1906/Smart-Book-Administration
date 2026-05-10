import React, { useState, useContext } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import "../StudentDashboard.css";

const StudentDashboardLayout = () => {
  const { role, logoutUser } = useContext(DataContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isStaff = location.pathname.startsWith('/staff');
  const basePath = isStaff ? '/staff' : '/student';
  const roleName = isStaff ? 'Staff' : 'Student';

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="student-dashboard d-flex">
      {/* ===== Sidebar ===== */}
      <aside className={`student-sidebar p-3 ${showSidebar ? "show" : ""}`}>
        <h4 className="text-center mb-4 student-title">
          <i className={isStaff ? "fa-solid fa-chalkboard-user me-2" : "fa-solid fa-user-graduate me-2"}></i>
          {roleName}
        </h4>

        <nav className="nav flex-column">
          {/* Dashboard */}
          <NavLink
            to={basePath}
            end
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-house me-2"></i>
            Home
          </NavLink>

          <NavLink
            to={`${basePath}/profile`}
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-user me-2"></i>
            Profile
          </NavLink>

          {/* Browse Books */}
          <NavLink
            to={`${basePath}/books`}
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-book-open me-2"></i>
            Browse Books
          </NavLink>

          {/* Issued Books */}
          <NavLink
            to={`${basePath}/issued`}
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-book me-2"></i>
            Issued Books
          </NavLink>

          {/* My Requests */}
          <NavLink
            to={`${basePath}/requests`}
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-inbox me-2"></i>
            My Requests
          </NavLink>

          {/* Logout */}
          <button
            className="nav-link custom-stu-logout-btn mt-3 text-start"
            style={{ border: "none", background: "none" }}
            onClick={() => {
              setShowLogoutModal(true);
              setShowSidebar(false);
            }}
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            Logout
          </button>
        </nav>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="student-main flex-grow-1">
        {/* Header */}
        <header className="student-header px-4 py-3 d-flex align-items-center">
          {/* Mobile Menu Button */}
          <button
            className="btn btn-outline-light d-md-none me-3"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <h5 className="mb-0 text-white student-dashboard-header-title">
            {roleName} Dashboard
          </h5>
        </header>

        {/* Page Content */}
        <main className="student-content p-4">
          <Outlet />
        </main>
      </div>

      {/* ===== LOGOUT CONFIRMATION MODAL ===== */}
      {showLogoutModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content p-4">
              <h5 className="mb-3 text-danger">
                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                Confirm Logout
              </h5>

              <p>
                Are you sure you want to logout from your account?
              </p>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardLayout;
