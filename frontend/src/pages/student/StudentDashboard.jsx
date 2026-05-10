import React from "react";
import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="student-dashboard-layout">
      {/* Sidebar */}
      <aside className="student-sidebar">
        <h2 className="sidebar-title">Library</h2>

        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li>Browse Books</li>
          <li>Issued Books</li>
          <li>My Requests</li>
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="student-main">
        {/* Header */}
        <div className="dashboard-header">
          <h2>Student Dashboard</h2>
          <p>Welcome back, Student 👋</p>
        </div>

        {/* Top summary cards */}
        <div className="summary-cards">
          <div className="summary-card blue">
            <h3>Books Issued</h3>
            <span>2</span>
          </div>

          <div className="summary-card green">
            <h3>Books Returned</h3>
            <span>5</span>
          </div>

          <div className="summary-card orange">
            <h3>Pending Requests</h3>
            <span>1</span>
          </div>

          <div className="summary-card red">
            <h3>Fine Amount</h3>
            <span>₹0</span>
          </div>
        </div>

        {/* Status cards */}
        <div className="status-cards">
          <div className="status-card">
            <h4>Issued</h4>
            <p>2 Books</p>
          </div>

          <div className="status-card">
            <h4>Returned</h4>
            <p>5 Books</p>
          </div>

          <div className="status-card">
            <h4>Not Returned</h4>
            <p>1 Book</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
