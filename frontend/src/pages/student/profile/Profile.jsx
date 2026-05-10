import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import ChangePassword from "../../../components/ChangePassword";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-danger">Failed to load profile.</div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0 p-4 mb-4">
        {/* ===== HEADER ===== */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-primary">
            <i className="fa-solid fa-user me-2"></i>
            My Profile
          </h5>
        </div>

        {/* ===== PROFILE CONTENT ===== */}
        <div className="row g-4 align-items-center">
          {/* LEFT: PHOTO */}
          <div className="col-12 col-md-4 text-center">
            <img
              src={"/src/assets/userAvatar.png" || "/images/default-avatar.png"}
              alt="Profile"
              className="rounded-circle shadow-sm"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
              onError={(e) => { e.target.src = "/src/assets/userAvatar.png"; }}
            />
            <h5 className="mt-3 mb-1">{user.fullName}</h5>
            <span className={`badge bg-${user.role === 'staff' ? 'success' : 'info'} text-capitalize`}>
              {user.role}
            </span>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="col-12 col-md-8">
            <div className="row g-3">
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Mobile" value={user.mobile} />
              <ProfileRow label="Department" value={user.departmentId} />

              {user.role === 'student' && (
                <>
                  <ProfileRow label="Register Number" value={user.registerNumber} />
                  <ProfileRow label="Course" value={user.course} />
                </>
              )}

              {user.role === 'staff' && (
                <>
                  <ProfileRow label="Staff ID" value={user.staffId} />
                  <ProfileRow label="Designation" value={user.designation} />
                </>
              )}

              <ProfileRow label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
            </div>
          </div>
        </div>
      </div>

      <ChangePassword />
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="col-12 col-md-6">
    <div className="p-3 bg-light rounded shadow-sm border h-100">
      <div className="text-muted small mb-1 fw-semibold">{label}</div>
      <div className="fw-bold">{value || 'N/A'}</div>
    </div>
  </div>
);

export default Profile;
