import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "AdminBooksColumns",
    {
      sNo: true,
      accessionNo: true,
      title: true,
      author: true,
      publication: true,
      year: true,
      price: true,
      status: true,
      action: true,
    }
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/books/all');
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = Object.values(book)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter = filter === "all" ? true : book.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [books, search, filter]);

  const markAsDamaged = async (bookId) => {
    if (!window.confirm("Are you sure you want to mark this book as damaged?")) return;
    try {
      await api.put(`/books/damaged/${bookId}`, { reason: "Admin marked as damaged" });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark book as damaged");
    }
  };

  const statusBadge = (status = "available") => {
    switch (status) {
      case "issued":
        return "bg-warning text-dark";
      case "damaged":
        return "bg-danger";
      case "requested":
        return "bg-info text-dark";
      default:
        return "bg-success";
    }
  };

  return (
    <>
      <h4 className="mb-4">Books Management</h4>

      {/* Filters & Toggles */}
      <div className="row g-3 mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Search by title, author, accession no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="requested">Requested</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        <div className="col-md-4 text-md-end">
          <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="table-responsive table-wrapper">
          <table className="table table-hover align-middle mb-0 fixed-table">
            <thead className="table-light">
              <tr>
                {visibleColumns.sNo && <th>S.No</th>}
                {visibleColumns.accessionNo && <th>Accession No</th>}
                {visibleColumns.title && <th>Title</th>}
                {visibleColumns.author && <th>Author</th>}
                {visibleColumns.publication && <th>Publication</th>}
                {visibleColumns.year && <th>Year</th>}
                {visibleColumns.price && <th>Price</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.action && <th className="text-end">Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    Loading books...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    No books found
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book._id}>
                    {visibleColumns.sNo && <td>{book.serialNumber || "-"}</td>}
                    {visibleColumns.accessionNo && <td>{book.accessionNumber}</td>}
                    {visibleColumns.title && <td>{book.title}</td>}
                    {visibleColumns.author && <td>{book.author}</td>}
                    {visibleColumns.publication && <td>{book.publication || "-"}</td>}
                    {visibleColumns.year && <td>{book.purchaseYear || "-"}</td>}
                    {visibleColumns.price && <td>₹{book.price}</td>}
                    {visibleColumns.status && (
                      <td>
                        <span className={`badge ${statusBadge(book.status)} text-capitalize`}>
                          {book.status || "available"}
                        </span>
                      </td>
                    )}
                    {visibleColumns.action && (
                      <td className="text-end">
                        {book.status !== "damaged" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => markAsDamaged(book._id)}
                          >
                            Mark Damaged
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
      </div>
    </>
  );
};

export default Books;
