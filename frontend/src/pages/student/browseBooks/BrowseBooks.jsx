import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./BrowseBooks.css";

function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/search?q=${search}`);
      setBooks(res.data);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only debounce if needed, simple fetch for now
    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const requestBook = async (bookId) => {
    try {
      await api.post(`/books/request/${bookId}`);
      alert("Book requested successfully!");
      fetchBooks(); // refresh to show updated status
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request book");
    }
  };

  return (
    <div className="browse-books">
      <h2 className="page-title">Browse Books</h2>
      <p className="page-subtitle">Explore available books in the library</p>

      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search books by title, author, or accession number..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book._id}>
              <h4>{book.title}</h4>
              <p>Author: {book.author}</p>
              <p className="text-muted small">Publication: {book.publication}</p>
              
              {book.status === 'available' ? (
                <span className="available d-block mb-3 text-success fw-bold">Available</span>
              ) : book.status === 'requested' ? (
                <span className="not-available d-block mb-3 text-warning fw-bold">Requested</span>
              ) : (
                <span className="not-available d-block mb-3 text-danger fw-bold">Not Available ({book.status})</span>
              )}

              <button 
                className={`btn w-100 fw-bold shadow-sm ${book.status === 'available' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => requestBook(book._id)}
                disabled={book.status !== 'available'}
              >
                {book.status === 'available' ? 'Request Book' : 'Unavailable'}
              </button>
            </div>
          ))}
          {books.length === 0 && <p className="text-center w-100 text-muted">No books found matching your criteria.</p>}
        </div>
      )}
    </div>
  );
}

export default BrowseBooks;
