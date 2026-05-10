import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import useColumnVisibility from "../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../components/common/ColumnToggle/ColumnToggle";
import "./StudentIssuedBooks.css";

function StudentIssuedBooks() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "StudentIssuedBooksColumns",
    {
      bookName: true,
      issueDate: true,
      dueDate: true,
      status: true,
    }
  );

  useEffect(() => {
    const fetchMyIssuedBooks = async () => {
      try {
        const response = await api.get('/books/issued/my');
        // Only show books that haven't been returned
        const activeIssued = (response.data || []).filter(b => !b.isReturned);
        setIssuedBooks(activeIssued);
      } catch (error) {
        console.error("Failed to fetch issued books", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIssuedBooks();
  }, []);

  return (
    <div className="issued-books">
      <h2 className="page-title">Issued Books</h2>
      <p className="page-subtitle">
        Books currently issued to you
      </p>

      {loading ? (
        <div className="text-center py-5">Loading issued books...</div>
      ) : (
        <>
          {/* ================= COLUMN TOGGLE ================= */}
          <div className="d-flex justify-content-end mb-3">
            <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
          </div>

          <div className="table-responsive table-wrapper">
            <table className="issued-table w-100 table-bordered fixed-table">
              <thead>
                <tr>
                  {visibleColumns.bookName && <th>Book Name</th>}
                  {visibleColumns.issueDate && <th>Issue Date</th>}
                  {visibleColumns.dueDate && <th>Due Date</th>}
                  {visibleColumns.status && <th>Status</th>}
                </tr>
              </thead>
            <tbody>
              {issuedBooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">You have no active issued books.</td>
                </tr>
              ) : (
                issuedBooks.map((issued) => {
                  const today = new Date();
                  const dueDate = new Date(issued.dueDate);
                  const isOverdue = today > dueDate;
                  
                  return (
                    <tr key={issued._id}>
                      {visibleColumns.bookName && <td>{issued.bookId?.title || "Unknown Book"}</td>}
                      {visibleColumns.issueDate && <td>{new Date(issued.issueDate).toLocaleDateString()}</td>}
                      {visibleColumns.dueDate && <td>{new Date(issued.dueDate).toLocaleDateString()}</td>}
                      {visibleColumns.status && (
                        <td className={isOverdue ? "status-overdue" : "status-issued"}>
                          <span className="fw-bold">{isOverdue ? "Overdue" : "Issued"}</span>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default StudentIssuedBooks;
