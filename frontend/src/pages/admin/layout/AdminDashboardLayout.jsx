import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import "./AdminDashboardLayout.css";

const AdminDashboardLayout = () => {
  const { logoutUser } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg admin-navbar shadow-sm">
        <div className="container-fluid px-4">
          {/* Brand */}
          <NavLink className="navbar-brand fw-bold" to="/admin">
            LibraManager
          </NavLink>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar content */}
          <div className="collapse navbar-collapse" id="adminNavbar">
            {/* Center navigation */}
            <ul className="navbar-nav mx-auto gap-lg-3">
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/users">
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-warning" to="/admin/pending">
                  Approvals
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/books">
                  Books
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/reports">
                  Reports
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/activity-log">
                  Activity Log
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/settings">
                  Settings
                </NavLink>
              </li>
            </ul>

            {/* Right side */}
            <div className="d-flex align-items-center gap-3">
              {/* Search */}
              <input
                type="search"
                className="form-control admin-search"
                placeholder="Search..."
              />

              {/* Profile dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Admin
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink className="dropdown-item" to="/admin/profile">
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-fluid admin-content px-4 py-4">
        <Outlet />
      </main>
    </>
  );
};

export default AdminDashboardLayout;
