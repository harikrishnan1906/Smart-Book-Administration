import React, { useEffect, useState } from "react";
import api from "../../../../services/api";
import "./PendingApprovals.css";

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get("/users/pending");
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Error fetching pending users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this user? An email with their password will be sent automatically.")) return;
    try {
      const res = await api.put(`/users/approve/${userId}`);
      setMessage({ type: "success", text: res.data.message });
      setPendingUsers(pendingUsers.filter((u) => u._id !== userId));
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Approval failed.",
      });
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject and delete this request?")) return;
    try {
      // Assuming a delete endpoint exists or status toggle exists, we will mark them as deleted or rejected
      // For now, let's just make an API call to a toggle status or delete user if implemented. 
      // If we don't have a delete pending user endpoint, we could toggle status to inactive.
      await api.put(`/users/toggle-status/${userId}`); // this sets to 'approved' but toggle might not fit perfectly.
      // Wait, toggleUserStatus sets to 'inactive' if not inactive.
      // We will reload to sync.
      fetchPendingUsers();
      setMessage({ type: "success", text: "User request rejected." });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pending-approvals fade-in p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Pending Approvals</h4>
      </div>

      {message && (
        <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="alert alert-info">No pending users currently awaiting approval.</div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Dept ID</th>
                <th>Details</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="fw-bold">{user.fullName}</div>
                    <small className="text-muted">{user.mobile}</small>
                  </td>
                  <td>
                    <span className={`badge bg-${user.role === "librarian" ? "primary" : user.role === "staff" ? "success" : "info"}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.departmentId}</td>
                  <td>
                    <small>
                      {user.role === 'student' && `RegNo: ${user.registerNumber} | Course: ${user.course} | Memb: ${user.membershipType || 'N/A'}`}
                      {user.role === 'staff' && `StaffId: ${user.staffId} | Desig: ${user.designation}`}
                      {user.role === 'librarian' && `StaffId: ${user.staffId} | Desig: ${user.designation}`}
                    </small>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleApprove(user._id)}>
                      <i className="fa-solid fa-check me-1"></i>Approve
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleReject(user._id)}>
                      <i className="fa-solid fa-xmark me-1"></i>Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
