import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./LibrarianDashboardHome.css";

const LibrarianDashboardHome = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    returnedBooks: 0,
    availableBooks: 0,
    staffServed: 0,
    studentsServed: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/books/librarian-stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load librarian stats", err);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="container-fluid">
      {/* Page Title */}
      <div className="mb-4">
        <h4 className="dashboard-heading">Welcome, Librarian 👋</h4>
        <p className="dashboard-subtext">
          Here’s a quick overview of the library status
        </p>
      </div>

      {/* Cards Row */}
      <div className="row g-4">
        {/* Total Books */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon bg-books">
              <i className="fa-solid fa-book"></i>
            </div>
            <div>
              <h6>Total Books</h6>
              <h4>{stats.totalBooks}</h4>
            </div>
          </div>
        </div>

        {/* Issued Books */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon bg-issued">
              <i className="fa-solid fa-arrow-right-arrow-left"></i>
            </div>
            <div>
              <h6>Issued Books</h6>
              <h4>{stats.issuedBooks}</h4>
            </div>
          </div>
        </div>

        {/* Returned Books */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon bg-returned">
              <i className="fa-solid fa-arrow-right-arrow-left"></i>
            </div>
            <div>
              <h6>Returned Books</h6>
              <h4>{stats.returnedBooks}</h4>
            </div>
          </div>
        </div>

        {/* Available Books */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon bg-available">
              <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <h6>Available Books</h6>
              <h4>{stats.availableBooks}</h4>
            </div>
          </div>
        </div>

        {/* Staff Served */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon bg-staff">
              <i className="fa-brands fa-google-scholar"></i>
            </div>
            <div>
              <h6>Staff Served</h6>
              <h4>{stats.staffServed}</h4>
            </div>
          </div>
        </div>

        {/* Students Served */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card">
            <div className="card-icon bg-students">
              <i className="fa-solid fa-user-graduate"></i>
            </div>
            <div>
              <h6>Students Served</h6>
              <h4>{stats.studentsServed}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboardHome;
