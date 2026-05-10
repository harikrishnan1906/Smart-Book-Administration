import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./SearchBooks.css";

const SearchBooks = () => {
  /* =============================
     DATA STATES
     ============================= */
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  /* =============================
     FILTER STATES
     ============================= */
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [publicationFilter, setPublicationFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  /* =============================
     COLUMN VISIBILITY STATE
     ============================= */
  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "SearchBooksColumns",
    {
      accessionNo: true,
      title: true,
      author: true,
      edition: true,
      purchaseYear: false,
      price: false,
      status: true,
    }
  );

  /* =============================
     MODAL STATE
     ============================= */
  const [selectedBook, setSelectedBook] = useState(null);

  /* =============================
     FILTER LOGIC
     ============================= */
  const filteredBooks = books.filter((book) => {
    const globalMatch = [
      book.accessionNumber,
      book.title,
      book.author,
      book.publication,
      book.edition,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const authorMatch = !authorFilter || book.author === authorFilter;

    const publicationMatch =
      !publicationFilter || book.publication === publicationFilter;

    const availabilityMatch =
      availabilityFilter === ""
        ? true
        : availabilityFilter === "available"
          ? book.status === "available"
          : book.status !== "available";

    return globalMatch && authorMatch && publicationMatch && availabilityMatch;
  });

  /* =============================
     DROPDOWN VALUES
     ============================= */
  const authors = [...new Set(books.map((b) => b.author).filter(Boolean))];
  const publications = [...new Set(books.map((b) => b.publication).filter(Boolean))];



  return (
    <div className="card search-books-card p-4">
      {/* ===== HEADER ===== */}
      <h6 className="section-heading mb-3">
        <i className="fa-solid fa-magnifying-glass me-2"></i>
        Search Books
      </h6>

      {/* ===== GLOBAL SEARCH ===== */}
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label>Search by Accession No, Title, Author, Edition</label>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="">All Authors</option>
            {authors.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={publicationFilter}
            onChange={(e) => setPublicationFilter(e.target.value)}
          >
            <option value="">All Publications</option>
            {publications.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable (Issued/Requested)</option>
          </select>
        </div>
      </div>

      {/* ===== COLUMN TOGGLE ===== */}
      <div className="d-flex justify-content-end">
        <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
      </div>

      {/* ===== SCROLLABLE TABLE ===== */}
      <div className="table-wrapper">
        <table className="table table-bordered fixed-table">
          <thead className="table-header">
            <tr>
              {visibleColumns.accessionNo && <th>Accession No</th>}
              {visibleColumns.title && <th>Title</th>}
              {visibleColumns.author && <th>Author</th>}
              {visibleColumns.edition && <th>Edition</th>}
              {visibleColumns.purchaseYear && <th>Year</th>}
              {visibleColumns.price && <th>Price</th>}
              {visibleColumns.status && <th>Status</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">Loading books...</td>
              </tr>
            ) : filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr
                  key={book._id}
                  className="clickable-row"
                  onClick={() => setSelectedBook(book)}
                >
                  {visibleColumns.accessionNo && (
                    <td>
                      <strong>{book.accessionNumber}</strong>
                    </td>
                  )}
                  {visibleColumns.title && <td>{book.title}</td>}
                  {visibleColumns.author && <td>{book.author}</td>}
                  {visibleColumns.edition && <td>{book.edition || "-"}</td>}
                  {visibleColumns.purchaseYear && (
                    <td>{book.purchaseYear || "-"}</td>
                  )}
                  {visibleColumns.price && <td>₹ {book.price || "-"}</td>}
                  {visibleColumns.status && (
                    <td>
                      {book.status === "available" ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-danger text-capitalize">{book.status}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== BOOK DETAILS MODAL ===== */}
      {selectedBook && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-lg-custom">
            <div className="modal-content p-4 border rounded shadow">
              <h5 className="mb-3">Book Details</h5>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Accession No:</strong> {selectedBook.accessionNumber}
                </li>
                <li className="list-group-item">
                  <strong>Serial No:</strong> {selectedBook.serialNumber || "-"}
                </li>
                <li className="list-group-item">
                  <strong>Title:</strong> {selectedBook.title}
                </li>
                <li className="list-group-item">
                  <strong>Author:</strong> {selectedBook.author}
                </li>
                <li className="list-group-item">
                  <strong>Publication:</strong> {selectedBook.publication}
                </li>
                <li className="list-group-item">
                  <strong>Edition:</strong> {selectedBook.edition || "-"}
                </li>
                <li className="list-group-item">
                  <strong>Purchase Year:</strong>{" "}
                  {selectedBook.purchaseYear || "-"}
                </li>
                <li className="list-group-item">
                  <strong>Price:</strong> ₹{selectedBook.price || "-"}
                </li>
                <li className="list-group-item">
                  <strong>Shelf/Rack:</strong> {selectedBook.shelf || "-"} / {selectedBook.rack || "-"}
                </li>
              </ul>

              <div className="text-end mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedBook(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
