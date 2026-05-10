import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import "./AdminLoginModal.css";

function AdminLoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const res = await loginUser(email, password, 'admin');
    setLoading(false);
    
    if (res.success) {
      document.getElementById('adminLoginModal').querySelector('.btn-close').click();
      navigate('/admin/dashboard');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <>
      {/* <!--Admin Login Modal --> */}
      <div
        className="modal fade"
        id="adminLoginModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content custom-admin-login-modal">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                <i className="fa-solid fa-user-gear"></i> Admin Login
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInputAdmin"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInputAdmin">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPasswordAdmin"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPasswordAdmin">Password</label>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLoginModal;