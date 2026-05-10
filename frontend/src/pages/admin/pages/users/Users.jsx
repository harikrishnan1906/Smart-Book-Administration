import { useState, useEffect, useMemo } from "react";
import api from "../../../../services/api";
import "./Users.css";

const Users = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (activeTab === "pending") {
        const res = await api.get('/users/pending');
        setUsers(res.data);
      } else {
        const res = await api.get('/users/all');
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  const handleApprove = async (userId) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/users/approve/${userId}`);
      alert(`User approved! Temporary Password: ${res.data.temporaryPassword}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve user");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      setActionLoading(true);
      await api.put(`/users/toggle-status/${userId}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to toggle status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <h4 className="mb-4">User Management</h4>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pending" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Approvals
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "all" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Users
          </button>
        </li>
      </ul>

      {/* Search */}
      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search users by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Department / ID</th>
                <th>Contact</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.fullName || user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary text-capitalize">{user.role}</span>
                    </td>
                    <td>
                      <span className="d-block">{user.departmentId?.name || "Unknown Dept"}</span>
                      <small className="text-muted">
                        {user.role === 'student' 
                          ? `${user.registerNumber || "N/A"} | Memb: ${user.membershipType || 'N/A'}`
                          : (user.staffId || "N/A")}
                      </small>
                    </td>
                    <td>{user.mobile || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "approved" || user.status === "active"
                            ? "bg-success"
                            : user.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        } text-capitalize`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {activeTab === "pending" ? (
                        <button
                          className="btn btn-sm btn-success fw-bold"
                          onClick={() => handleApprove(user._id)}
                          disabled={actionLoading}
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          className={`btn btn-sm ${
                            user.status === "inactive"
                              ? "btn-outline-success"
                              : "btn-outline-danger"
                          }`}
                          onClick={() => toggleStatus(user._id)}
                          disabled={actionLoading}
                        >
                          {user.status === "inactive" ? "Activate" : "Deactivate"}
                        </button>
                      )}
                    </td>
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

export default Users;
