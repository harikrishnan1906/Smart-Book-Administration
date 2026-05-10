import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./ReturnedBooks.css";

const ReturnedBooks = () => {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "ReturnedBooksColumns",
    {
      index: true,
      studentUser: true,
      book: true,
      issueDate: true,
      returnDate: true,
      fineInfo: true,
      action: true,
    }
  );

  const fetchReturnedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/issued?status=returned');
      setReturnedBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch returned books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  const handleCollectFine = async (issueId) => {
    try {
      setActionLoading(true);
      await api.put(`/books/fine/collect/${issueId}`);
      fetchReturnedBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to collect fine");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card returned-books-card p-4">
      <h6 className="section-heading mb-3">
        <i className="fa-solid fa-rotate-left me-2"></i>
        Returned Books History
      </h6>

      {loading ? (
        <div className="text-center py-4">Loading returned books...</div>
      ) : (
        <>
          {/* ===== COLUMN TOGGLE ===== */}
          <div className="d-flex justify-content-end mb-3 mt-md-0 mt-3">
            <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="d-none d-md-block table-wrapper">
            <table className="table table-bordered align-middle fixed-table">
              <thead className="table-header">
                <tr>
                  {visibleColumns.index && <th>#</th>}
                  {visibleColumns.studentUser && <th>Student/User</th>}
                  {visibleColumns.book && <th>Book</th>}
                  {visibleColumns.issueDate && <th>Issue Date</th>}
                  {visibleColumns.returnDate && <th>Return Date</th>}
                  {visibleColumns.fineInfo && <th>Fine Info</th>}
                  {visibleColumns.action && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {returnedBooks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No returned books found
                    </td>
                  </tr>
                ) : (
                  returnedBooks.map((book, index) => (
                    <tr key={book._id}>
                      {visibleColumns.index && <td>{index + 1}</td>}
                      {visibleColumns.studentUser && (
                        <td>
                          <strong>{book.userId?.fullName || book.userId?.name || "Unknown"}</strong>
                          <br />
                          <small className="text-muted text-capitalize">{book.userId?.role || "user"}</small>
                        </td>
                      )}
                      {visibleColumns.book && (
                        <td>
                          <strong>{book.bookId?.title || "Unknown Book"}</strong>
                          <br/>
                          <small className="text-muted">Accession: {book.bookId?.accessionNumber}</small>
                        </td>
                      )}
                      {visibleColumns.issueDate && <td>{new Date(book.issueDate).toLocaleDateString()}</td>}
                      {visibleColumns.returnDate && <td>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'N/A'}</td>}
                      {visibleColumns.fineInfo && (
                        <td>
                          {book.fineAmount > 0 ? (
                            <span className={`badge ${book.fineCollected ? 'bg-success' : 'bg-danger'}`}>
                              ₹{book.fineAmount} {book.fineCollected ? '(Paid)' : '(Unpaid)'}
                            </span>
                          ) : (
                            <span className="badge bg-success">₹0</span>
                          )}
                        </td>
                      )}
                      {visibleColumns.action && (
                        <td>
                          {book.fineAmount > 0 && !book.fineCollected ? (
                            <button 
                              className="btn btn-sm btn-warning fw-bold text-dark w-100"
                              onClick={() => handleCollectFine(book._id)}
                              disabled={actionLoading}
                            >
                              Collect
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-secondary w-100" disabled>
                              Resolved
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="d-md-none">
            {returnedBooks.length === 0 && (
              <p className="text-muted text-center">No returned books found</p>
            )}

            {returnedBooks.map((book) => (
              <div key={book._id} className="returned-card mb-3 p-3 border rounded shadow-sm">
                <div className="returned-row">
                  <span className="label fw-bold">User:</span>
                  <span>{book.userId?.fullName || book.userId?.name}</span>
                </div>
                <div className="returned-row mt-1">
                  <span className="label fw-bold">Book:</span>
                  <span>{book.bookId?.title}</span>
                </div>
                <div className="returned-row mt-1">
                  <span className="label fw-bold">Returned On:</span>
                  <span>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'N/A'}</span>
                </div>

                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${
                      book.fineAmount > 0 
                        ? (book.fineCollected ? "bg-success" : "bg-danger") 
                        : "bg-success"
                    } px-2 py-1`}
                  >
                    Fine: ₹{book.fineAmount || 0} {book.fineAmount > 0 ? (book.fineCollected ? '(Paid)' : '(Unpaid)') : ''}
                  </span>
                  
                  {book.fineAmount > 0 && !book.fineCollected && (
                    <button 
                      className="btn btn-sm btn-warning fw-bold text-dark"
                      onClick={() => handleCollectFine(book._id)}
                      disabled={actionLoading}
                    >
                      Collect Fine
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnedBooks;
