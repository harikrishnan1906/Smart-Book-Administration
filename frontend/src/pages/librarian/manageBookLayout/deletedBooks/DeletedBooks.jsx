import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./DeletedBooks.css";

const DeletedBooks = () => {
  const [deletedBooks, setDeletedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "DeletedBooksColumns",
    {
      serialNo: false,
      accessionNo: true,
      title: true,
      author: true,
      publication: true,
      edition: false,
      purchaseYear: false,
      price: false,
      action: true,
    }
  );

  const fetchDeletedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/damaged');
      setDeletedBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch damaged books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedBooks();
  }, []);

  const restoreBook = async (book) => {
    try {
      setActionLoading(true);
      await api.put(`/books/restore/${book._id}`);
      fetchDeletedBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to restore book");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card deleted-books-card p-4">
      <h6 className="section-heading mb-3">
        <i className="fa-solid fa-clock-rotate-left me-2"></i>
        Damaged / Deleted Books
      </h6>

      {/* ===== COLUMN TOGGLE ===== */}
      <div className="d-flex justify-content-end mb-3">
        <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="d-none d-md-block table-wrapper">
        <table className="table table-bordered align-middle fixed-table">
          <thead className="table-header">
            <tr>
              {visibleColumns.serialNo && <th>Serial No</th>}
              {visibleColumns.accessionNo && <th>Accession No</th>}
              {visibleColumns.title && <th>Title</th>}
              {visibleColumns.author && <th>Author</th>}
              {visibleColumns.publication && <th>Publication</th>}
              {visibleColumns.edition && <th>Edition</th>}
              {visibleColumns.purchaseYear && <th>Purchase Year</th>}
              {visibleColumns.price && <th>Price</th>}
              {visibleColumns.action && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">Loading damaged books...</td>
              </tr>
            ) : deletedBooks.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No damaged books found
                </td>
              </tr>
            ) : (
              deletedBooks.map((book) => (
                <tr key={book._id}>
                  {visibleColumns.serialNo && <td>{book.serialNumber || "-"}</td>}
                  {visibleColumns.accessionNo && (
                    <td><strong>{book.accessionNumber}</strong></td>
                  )}
                  {visibleColumns.title && <td>{book.title}</td>}
                  {visibleColumns.author && <td>{book.author}</td>}
                  {visibleColumns.publication && <td>{book.publication}</td>}
                  {visibleColumns.edition && <td>{book.edition || "-"}</td>}
                  {visibleColumns.purchaseYear && <td>{book.purchaseYear || "-"}</td>}
                  {visibleColumns.price && <td>₹ {book.price || "-"}</td>}
                  {visibleColumns.action && (
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => restoreBook(book)}
                        disabled={actionLoading}
                      >
                        <i className="fa-solid fa-rotate-left me-1"></i>
                        Restore
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="d-md-none">
        {deletedBooks.length === 0 && !loading && (
          <p className="text-muted text-center">No damaged books found</p>
        )}

        {deletedBooks.map((book) => (
          <div key={book._id} className="book-card mb-3 p-3 border rounded shadow-sm">
            <div className="book-card-row">
              <span className="label fw-bold">Serial No:</span>
              <span>{book.serialNumber || "-"}</span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Accession No:</span>
              <span>
                <strong>{book.accessionNumber}</strong>
              </span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Title:</span>
              <span>{book.title}</span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Author:</span>
              <span>{book.author}</span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Publication:</span>
              <span>{book.publication}</span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Edition:</span>
              <span>{book.edition || "-"}</span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Purchase Year:</span>
              <span>{book.purchaseYear || "-"}</span>
            </div>

            <div className="book-card-row mt-1">
              <span className="label fw-bold">Price:</span>
              <span>₹ {book.price || "-"}</span>
            </div>

            <div className="text-end mt-3">
              <button
                className="btn btn-success btn-sm"
                onClick={() => restoreBook(book)}
                disabled={actionLoading}
              >
                <i className="fa-solid fa-rotate-left me-1"></i>
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeletedBooks;
