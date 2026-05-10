import React, { useState } from "react";
import api from "../../../../services/api";
import "./AddBooks.css";

const AddBooks = () => {
  const [validated, setValidated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBook, setPendingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    serialNumber: "",
    accessionNo: "",
    title: "",
    author: "",
    publication: "",
    edition: "",
    entryDate: "",
    purchaseYear: "",
    price: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const newBook = {
      serialNumber: formData.serialNumber,
      accessionNumber: formData.accessionNo,
      title: formData.title,
      author: formData.author,
      publication: formData.publication,
      edition: formData.edition || "none",
      purchaseYear: formData.purchaseYear,
      price: formData.price,
      shelf: "A1", // Default shelf
      rack: "R1", // Default rack
    };

    setPendingBook(newBook);
    setShowConfirmModal(true);
  };

  const confirmAddBook = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.post('/books/add', pendingBook);
      setMessage({ type: 'success', text: 'Book added successfully!' });
      
      setFormData({
        serialNumber: "",
        accessionNo: "",
        title: "",
        author: "",
        publication: "",
        edition: "",
        entryDate: "",
        purchaseYear: "",
        price: "",
      });
      setValidated(false);
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to add book'
      });
    } finally {
      setLoading(false);
      setPendingBook(null);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="card add-book-card p-4">
      <h6 className="mb-4 section-heading">
        <i className="fa-solid fa-circle-plus me-2"></i>
        Add New Book
      </h6>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form
        className={`row g-3 needs-validation ${
          validated ? "was-validated" : ""
        }`}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
            />
            <label>Serial Number</label>
            <div className="invalid-feedback">Required</div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="accessionNo"
              value={formData.accessionNo}
              onChange={handleChange}
              required
            />
            <label>Accession Number</label>
            <div className="invalid-feedback">Required</div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label>Book Title</label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <label>Author Name</label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="publication"
              value={formData.publication}
              onChange={handleChange}
              required
            />
            <label>Publication</label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="edition"
              value={formData.edition}
              onChange={handleChange}
            />
            <label>Edition</label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="purchaseYear"
              value={formData.purchaseYear}
              onChange={handleChange}
              required
            />
            <label>Purchase Year</label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <label>Book Price</label>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="date"
              className="form-control"
              id="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              required
            />
            <label>Entry Date</label>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-primary px-4">
            <i className="fa-solid fa-floppy-disk me-2"></i>
            Add Book
          </button>
        </div>
      </form>

      {showConfirmModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content p-4">
              <h6>Confirm Add Book</h6>
              <p className="mt-2">
                Add book <strong>{pendingBook?.title}</strong> with accession
                number <strong>{pendingBook?.accessionNumber}</strong>?
              </p>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={confirmAddBook}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBooks;
