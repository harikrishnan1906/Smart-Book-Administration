import React, { useState } from 'react';
import api from '../services/api';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'danger', text: 'New passwords do not match' });
    }

    try {
      const res = await api.put('/users/me/change-password', {
        currentPassword,
        newPassword
      });
      setMessage({ type: 'success', text: res.data.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to change password'
      });
    }
  };

  return (
    <div className="card mt-4 p-4 shadow-sm border-0">
      <h6 className="section-heading mb-4">
        <i className="fa-solid fa-lock me-2 text-primary"></i>
        Change Password
      </h6>
      
      {message && (
        <div className={`alert alert-${message.type} py-2`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label text-muted small mb-1">Current Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label text-muted small mb-1">New Password</label>
          <input 
            type="password" 
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label text-muted small mb-1">Confirm New Password</label>
          <input 
             type="password" 
             className="form-control"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             required
             minLength={6}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary mt-2">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
