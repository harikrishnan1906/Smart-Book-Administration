import { useEffect, useState } from "react";
import api from "../../../../services/api";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/admin/profile');
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-5">Loading profile...</div>;
  if (!admin) return <div className="text-center py-5 text-muted">Failed to load profile</div>;

  return (
    <>
      <h4 className="mb-4">Admin Profile</h4>

      <div className="card shadow-sm profile-card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Admin ID</div>
            <div className="col-sm-8 fw-semibold">{admin.id}</div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Name</div>
            <div className="col-sm-8 fw-semibold">{admin.name}</div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Email</div>
            <div className="col-sm-8 fw-semibold">{admin.email}</div>
          </div>

          <div className="row">
            <div className="col-sm-4 text-muted">Session Logged</div>
            <div className="col-sm-8 fw-semibold">
              {new Date(admin.lastLogin).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
