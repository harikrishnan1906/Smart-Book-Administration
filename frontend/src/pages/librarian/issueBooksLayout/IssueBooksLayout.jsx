import './IssueBooksLayout.css'
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";


const IssueBooksLayout = () => {
  // 🔹 Dummy student book requests
  const [bookRequests, setBookRequests] = useState([
    {
      requestId: 1,
      studentId: "24MIT401",
      studentName: "Arun Kumar",
      bookId: 101,
      bookTitle: "Clean Code",
      requestDate: "2024-01-10",
      status: "pending",
    },
    {
      requestId: 2,
      studentId: "24MIT402",
      studentName: "Bala murugan",
      bookId: 102,
      bookTitle: "Operating System Concepts",
      requestDate: "2024-01-11",
      status: "pending",
    },
  ]);

  // 🔹 Issued books list
  const [issuedBooks, setIssuedBooks] = useState([]);

  return (
    <div>
      {/* ===== PAGE HEADER ===== */}
      <div className="mb-4">
        <h4 style={{ color: "var(--darkerTextColor)", fontWeight: 600 }}>
          Issue & Issued Books
        </h4>
        <p style={{ fontSize: "14px", color: "var(--darkTextColor)" }}>
          Manage book requests, issue books, and track returns
        </p>
      </div>

      {/* ===== SUB NAVIGATION ===== */}
      <ul className="nav nav-pills mb-4 flex-wrap">
        <li className="nav-item">
          <NavLink to="requests" className="nav-link">
            <i className="fa-solid fa-inbox me-2"></i>
            Book Requests
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="issued" className="nav-link">
            <i className="fa-solid fa-book me-2"></i>
            Issued Books
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="returned" className="nav-link">
            <i className="fa-solid fa-rotate-left me-2"></i>
            Returned Books
          </NavLink>
        </li>
      </ul>

      {/* ===== CHILD CONTENT ===== */}
      <Outlet
        context={{
          bookRequests,
          setBookRequests,
          issuedBooks,
          setIssuedBooks,
        }}
      />
    </div>
  );
};

export default IssueBooksLayout;
