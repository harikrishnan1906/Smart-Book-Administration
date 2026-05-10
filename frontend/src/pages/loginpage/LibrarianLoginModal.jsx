import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import "./LibrarianLoginModal.css";

function LibrarianLoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const res = await loginUser(email, password, 'librarian'); // Ensure role matches backend definition
    setLoading(false);
    
    if (res.success) {
      document.getElementById('librarianLoginModal').querySelector('.btn-close').click();
      navigate('/librarian');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <>
      {/* Librarian Login Modal */}
      <div
        className="modal fade "
        id="librarianLoginModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="librarianModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content custom-librarian-login-modal">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="librarianModalLabel">
                <i className="fa-solid fa-book-open-reader"></i> Librarian Login
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="librarianEmail"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="librarianEmail">Email address</label>
              </div>

              {/* Password */}
              <div className="form-floating mb-2">
                <input
                  type="password"
                  className="form-control"
                  id="librarianPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="librarianPassword">Password</label>
              </div>

              {/* Forgot Password */}
              <div className="text-start mb-3">
                <a
                  href="#"
                  className="text-decoration-none text-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#forgotPasswordModal"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            {/* Register */}
            <div className="text-center mb-3 mt-2">
              <p className="mb-0">
                Don’t have an account?{" "}
                <a
                  href="#"
                  className="fw-semibold text-primary "
                  data-bs-toggle="modal"
                  data-bs-target="#librarianRegistrationModal"
                >
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LibrarianLoginModal;