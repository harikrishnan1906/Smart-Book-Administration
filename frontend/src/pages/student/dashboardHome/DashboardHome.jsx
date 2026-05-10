import React from "react";
import "./DashboardHome.css";

function DashboardHome() {
  return (
    <div className="dashboard-home">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-subtitle">Welcome to your library account</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>Books Issued</h4>
          <span>2</span>
        </div>

        <div className="dashboard-card">
          <h4>Pending Requests</h4>
          <span>1</span>
        </div>

        <div className="dashboard-card">
          <h4>Books Returned</h4>
          <span>5</span>
        </div>

        <div className="dashboard-card">
          <h4>Fine Amount</h4>
          <span>₹0</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
