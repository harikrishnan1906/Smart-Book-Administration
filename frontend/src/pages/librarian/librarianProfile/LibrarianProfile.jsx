import React, { useState, useEffect } from "react";
import "./LibrarianProfile.css";
import api from "../../../services/api";
import ChangePassword from "../../../components/ChangePassword";

const LibrarianProfile = () => {
  const [librarian, setLibrarian] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dropdown options
  const designationOptions = [
    "Professor",
    "Assistant Professor",
    "Associate Professor",
    "Lab Assistant",
    "Guest Lecturer",
  ];

  const departmentOptions = [
    "Tamil",
    "English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Computer Science",
    "Information Technology",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setLibrarian(res.data);
      } catch (err) {
        console.error("Failed to fetch librarian profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibrarian((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put('/users/me/profile', {
        fullName: librarian.fullName,
        mobile: librarian.mobile,
        designation: librarian.designation,
        departmentId: librarian.departmentId
      });
      setLibrarian(res.data.user);
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (!librarian) {
    return <div className="p-4 text-center text-danger">Failed to load profile.</div>;
  }

  return (
    <div className="card librarian-profile-card p-4">
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="section-heading mb-0">
          <i className="fa-solid fa-user-tie me-2"></i>
          Librarian Profile
        </h6>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setShowEditModal(true)}
        >
          <i className="fa-solid fa-pen me-1"></i>
          Edit Profile
        </button>
      </div>

      {/* ===== PROFILE CONTENT ===== */}
      <div className="row g-4 align-items-center">
        {/* LEFT: PHOTO */}
        <div className="col-12 col-md-4 text-center">
          <img
            src={librarian.profilePic || "/images/librarian-avatar.png"}
            alt="Librarian"
            className="profile-avatar"
            onError={(e) => { e.target.src = "/src/assets/soranaProfile.jpeg"; }}
          />
          <h6 className="mt-3 mb-1">{librarian.fullName}</h6>
          <small className="text-muted">{librarian.designation}</small>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="col-12 col-md-8">
          <div className="row g-3">
            <ProfileRow label="Staff ID" value={librarian.staffId} />
            <ProfileRow label="Email" value={librarian.email} />
            <ProfileRow label="Mobile" value={librarian.mobile} />
            <ProfileRow label="Department" value={librarian.departmentId} />
            <ProfileRow label="Role" value={<span className="text-capitalize">{librarian.role}</span>} />
            <ProfileRow label="Joined" value={new Date(librarian.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-lg-custom">
            <div className="modal-content p-4 p-md-5">
              <h5 className="mb-4">Edit Librarian Profile</h5>

              <div className="row g-3">
                <InputField
                  label="Name"
                  name="fullName"
                  value={librarian.fullName}
                  onChange={handleChange}
                />

                <InputField
                  label="Email"
                  name="email"
                  value={librarian.email}
                  onChange={handleChange}
                  disabled={true}
                />

                <InputField
                  label="Mobile"
                  name="mobile"
                  value={librarian.mobile}
                  onChange={handleChange}
                />

                <SelectField
                  label="Designation"
                  name="designation"
                  value={librarian.designation}
                  onChange={handleChange}
                  options={designationOptions}
                />

                <SelectField
                  label="Department"
                  name="departmentId"
                  value={librarian.departmentId}
                  onChange={handleChange}
                  options={departmentOptions}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CHANGE PASSWORD ===== */}
      <ChangePassword />
    </div>
  );
};

/* ===== REUSABLE COMPONENTS ===== */

const ProfileRow = ({ label, value }) => (
  <div className="col-12 col-md-6">
    <div className="profile-row">
      <span className="profile-label">{label}</span>
      <span className="profile-value">{value}</span>
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div className="col-12 col-md-6">
    <div className="form-floating">
      <input
        type="text"
        className="form-control"
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
      />
      <label>{label}</label>
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="col-12 col-md-6">
    <div className="form-floating">
      <select
        className="form-select"
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="">-- Select {label} --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label>{label}</label>
    </div>
  </div>
);

export default LibrarianProfile;
