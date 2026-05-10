import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./IssuedBooks.css";

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "IssuedBooksColumns",
    {
      issuedTo: true,
      book: true,
      issueDate: true,
      dueDate: true,
      status: true,
      action: true,
    }
  );

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/issued?status=active');
      setIssuedBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch issued books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const today = new Date();

  const calculateFine = (dueDate) => {
    const due = new Date(dueDate);
    const diffTime = today - due;
    const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysLate > 0 ? daysLate * 5 : 0;
  };

  const handleReturn = (issuedBook) => {
    setSelectedBook(issuedBook);
  };

  const confirmReturn = async () => {
    try {
      setActionLoading(true);
      await api.put(`/books/return/${selectedBook._id}`);
      fetchIssuedBooks();
      setSelectedBook(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to return book");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card issued-books-card p-4">
      <h6 className="section-heading mb-3">
        <i className="fa-solid fa-book me-2"></i>
        Active Issued Books
      </h6>

      {loading ? (
        <div className="text-center py-4">Loading issued books...</div>
      ) : (
        <>
          {/* ================= COLUMN TOGGLE ================= */}
          <div className="d-flex justify-content-end mb-3 mt-md-0 mt-3">
            <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="d-none d-md-block table-wrapper">
            <table className="table table-bordered align-middle fixed-table">
              <thead className="table-header">
                <tr>
                  {visibleColumns.issuedTo && <th>Issued To</th>}
                  {visibleColumns.book && <th>Book</th>}
                  {visibleColumns.issueDate && <th>Issue Date</th>}
                  {visibleColumns.dueDate && <th>Due Date</th>}
                  {visibleColumns.status && <th>Status</th>}
                  {visibleColumns.action && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {issuedBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No active issued books
                    </td>
                  </tr>
                ) : (
                  issuedBooks.map((item) => {
                    const fine = calculateFine(item.dueDate);
                    const isOverdue = fine > 0;

                    return (
                      <tr key={item._id}>
                        {visibleColumns.issuedTo && (
                          <td>
                            <strong>{item.userId?.fullName || item.userId?.name || "Unknown"}</strong>
                            <br />
                            <small className="text-muted text-capitalize">
                              {item.userId?.role || "user"}
                            </small>
                          </td>
                        )}

                        {visibleColumns.book && (
                          <td>
                            <strong>{item.bookId?.title || "Unknown Book"}</strong>
                            <br />
                            <small className="text-muted">
                              Accession No: {item.bookId?.accessionNumber}
                            </small>
                          </td>
                        )}

                        {visibleColumns.issueDate && <td>{new Date(item.issueDate).toLocaleDateString()}</td>}
                        {visibleColumns.dueDate && <td>{new Date(item.dueDate).toLocaleDateString()}</td>}

                        {visibleColumns.status && (
                          <td>
                            {isOverdue ? (
                              <span className="badge bg-danger">Overdue ₹{fine}</span>
                            ) : (
                              <span className="badge bg-success">On Time</span>
                            )}
                          </td>
                        )}

                        {visibleColumns.action && (
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleReturn(item)}
                            >
                              Return
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="d-md-none">
            {issuedBooks.length === 0 && (
              <p className="text-muted text-center">No active issued books</p>
            )}

            {issuedBooks.map((item) => {
              const fine = calculateFine(item.dueDate);
              const isOverdue = fine > 0;

              return (
                <div key={item._id} className="issued-card mb-3 p-3 border rounded shadow-sm">
                  <div className="issued-row">
                    <span className="label fw-bold">Issued To:</span>
                    <span>{item.userId?.fullName || item.userId?.name}</span>
                  </div>

                  <div className="issued-row mt-1">
                    <span className="label fw-bold">Book:</span>
                    <span>{item.bookId?.title}</span>
                  </div>

                  <div className="issued-row mt-1">
                    <span className="label fw-bold">Accession No:</span>
                    <span>
                      <strong>{item.bookId?.accessionNumber}</strong>
                    </span>
                  </div>

                  <div className="issued-row mt-1">
                    <span className="label fw-bold">Due Date:</span>
                    <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="text-end mt-3">
                    {isOverdue ? (
                      <span className="badge bg-danger me-2">Overdue ₹{fine}</span>
                    ) : (
                      <span className="badge bg-success me-2">On Time</span>
                    )}

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleReturn(item)}
                    >
                      Return
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ================= RETURN CONFIRMATION MODAL ================= */}
      {selectedBook && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content p-4 border rounded shadow">
              <h6>Confirm Return</h6>

              <p className="mt-2">
                Return <strong>{selectedBook.bookId?.title}</strong> from{" "}
                <strong>{selectedBook.userId?.fullName || selectedBook.userId?.name}</strong>?
              </p>

              {calculateFine(selectedBook.dueDate) > 0 && (
                <p className="text-danger fw-bold">
                  Fine to be calculated: ₹{calculateFine(selectedBook.dueDate)}
                </p>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedBook(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={confirmReturn}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Returning..." : "Confirm Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuedBooks;
