import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./DeleteBooks.css";

const DeleteBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "DeleteBooksColumns",
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

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/search');
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [publicationFilter, setPublicationFilter] = useState("");

  // Delete confirmation modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ===============================
     FILTER LOGIC
     =============================== */
  const filteredBooks = books.filter((book) => {
    const matchesSearch = [
      book.serialNumber,
      book.accessionNumber,
      book.title,
      book.author,
      book.publication,
      book.edition,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesAuthor = !authorFilter || book.author === authorFilter;
    const matchesPublication =
      !publicationFilter || book.publication === publicationFilter;

    return matchesSearch && matchesAuthor && matchesPublication;
  });

  // Dropdown values
  const authors = [...new Set(books.map((b) => b.author).filter(Boolean))];
  const publications = [...new Set(books.map((b) => b.publication).filter(Boolean))];

  // Open confirmation modal
  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Confirm delete (soft delete using damage API)
  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      await api.put(`/books/damaged/${selectedBook._id}`, { reason: "Marked as deleted/damaged by Librarian" });
      setShowModal(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete book");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card delete-books-card p-4">
      <h6 className="section-heading mb-3">
        <i className="fa-solid fa-trash me-2"></i>
        Delete Books
      </h6>

      {/* ================= SEARCH ================= */}
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            placeholder="Search books"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label>
            Search (Serial No, Accession No, Title, Author, Publication)
          </label>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="row g-3 mb-4">
        {/* Author */}
        <div className="col-12 col-md-6">
          <div className="form-floating">
            <select
              className="form-select"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
            <label>Author</label>
          </div>
        </div>

        {/* Publication */}
        <div className="col-12 col-md-6">
          <div className="form-floating">
            <select
              className="form-select"
              value={publicationFilter}
              onChange={(e) => setPublicationFilter(e.target.value)}
            >
              <option value="">All Publications</option>
              {publications.map((pub) => (
                <option key={pub} value={pub}>
                  {pub}
                </option>
              ))}
            </select>
            <label>Publication</label>
          </div>
        </div>
      </div>

      {/* ================= COLUMN TOGGLE ================= */}
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
                <td colSpan="9" className="text-center py-4 text-muted">Loading books...</td>
              </tr>
            ) : filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No matching books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
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
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(book)}
                      >
                        <i className="fa-solid fa-trash"></i>
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
        {filteredBooks.length === 0 && !loading && (
          <p className="text-muted text-center">No matching books found</p>
        )}

        {filteredBooks.map((book) => (
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
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteClick(book)}
              >
                <i className="fa-solid fa-trash me-1"></i>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CONFIRM DELETE MODAL ================= */}
      {showModal && selectedBook && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content p-4 border rounded shadow">
              <h6>Confirm Delete</h6>
              <p className="mt-2">
                Mark book <strong>{selectedBook.title}</strong> as damaged/deleted?
                <br />
                Accession No: <strong>{selectedBook.accessionNumber}</strong>
              </p>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={confirmDelete}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteBooks;
