import React, { useState, useEffect, useContext } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import "./LibrarianDashboardLayout.css";

const LibrarianDashboardLayout = () => {
  const { logoutUser } = useContext(DataContext);
  const [showIssueMenu, setShowIssueMenu] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showBooksMenu, setShowBooksMenu] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    if (location.pathname.startsWith("/librarian/issue")) {
      setShowIssueMenu(true);
    }
  }, [location.pathname]);

  // ✅ Auto-open "Manage Books" when route matches
  useEffect(() => {
    if (location.pathname.startsWith("/librarian/books")) {
      setShowBooksMenu(true);
    }
  }, [location.pathname]);

  return (
    <div className="librarian-dashboard d-flex">
      {/* ===== Sidebar ===== */}
      <aside className={`librarian-sidebar p-3 ${showSidebar ? "show" : ""}`}>
        <h4 className="text-center mb-4 librarian-title">
          <i className="fa-solid fa-book-open me-2"></i>
          Librarian 
        </h4>

        <nav className="nav flex-column">
          {/* Dashboard */}
          <NavLink
            to="/librarian"
            end
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-house me-2"></i>
            Home
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/librarian/profile"
            className="nav-link"
            onClick={() => setShowSidebar(false)}
          >
            <i className="fa-solid fa-user me-2"></i>
            Profile
          </NavLink>

          {/* Manage Books (Toggle) */}
          <div
            className={`nav-link d-flex justify-content-between align-items-center ${
              location.pathname.startsWith("/librarian/books") ? "active" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setShowBooksMenu(!showBooksMenu)}
          >
            <span>
              <i className="fa-solid fa-book me-2"></i>
              Manage Books
            </span>
            <i
              className={`fa-solid fa-chevron-${
                showBooksMenu ? "down" : "right"
              }`}
            ></i>
          </div>

          {/* Manage Books Submenu */}
          {showBooksMenu && (
            <div className="ms-4">
              <NavLink
                to="/librarian/books/search"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-magnifying-glass me-2"></i>
                Search Books
              </NavLink>

              <NavLink
                to="/librarian/books/add"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-plus me-2"></i>
                Add Books
              </NavLink>

              <NavLink
                to="/librarian/books/delete"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-trash me-2"></i>
                Delete Books
              </NavLink>

              <NavLink
                to="/librarian/books/deleted"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-clock-rotate-left me-2"></i>
                Damaged Books
              </NavLink>
            </div>
          )}

          {/* Issue & Issued Books */}
          <div
            className={`nav-link d-flex justify-content-between align-items-center ${
              location.pathname.startsWith("/librarian/issue") ? "active" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setShowIssueMenu(!showIssueMenu)}
          >
            <span>
              <i className="fa-solid fa-arrow-right-arrow-left me-2"></i>
              Issue Books
            </span>
            <i
              className={`fa-solid fa-chevron-${
                showIssueMenu ? "down" : "right"
              }`}
            ></i>
          </div>

          {showIssueMenu && (
            <div className="ms-4">
              <NavLink
                to="/librarian/issue/requests"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-inbox me-2"></i>
                Book Requests
              </NavLink>

              <NavLink
                to="/librarian/issue/issued"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-book me-2"></i>
                Issued Books
              </NavLink>

              <NavLink
                to="/librarian/issue/returned"
                className="nav-link"
                onClick={() => setShowSidebar(false)}
              >
                <i className="fa-solid fa-rotate-left me-2"></i>
                Returned Books
              </NavLink>
            </div>
          )}

          {/* Logout */}
          <button
            className="nav-link custom-lib-logout-btn mt-3 text-start"
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
      <div className="librarian-main flex-grow-1">
        {/* Header */}
        <header className="librarian-header px-4 py-3 d-flex align-items-center">
          {/* Mobile Menu Button */}
          <button
            className="btn btn-outline-light d-md-none me-3"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <h5 className="mb-0 text-white librarian-dashboard-header-title">
            Librarian Dashboard
          </h5>
        </header>

        {/* Page Content */}
        <main className="librarian-content p-4">
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
                Are you sure you want to logout from the librarian dashboard?
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

export default LibrarianDashboardLayout;
