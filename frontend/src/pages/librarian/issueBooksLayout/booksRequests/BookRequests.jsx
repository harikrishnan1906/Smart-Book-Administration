import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import "./BookRequests.css";

const BookRequests = () => {
  const [bookRequests, setBookRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "BookRequestsColumns",
    {
      requester: true,
      book: true,
      requestDate: true,
      type: true,
      action: true,
    }
  );

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/requests/pending');
      setBookRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch pending requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleIssue = (request) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmIssue = async () => {
    try {
      setActionLoading(true);
      await api.put(`/books/requests/approve/${selectedRequest._id}`);
      fetchPendingRequests();
      setShowConfirmModal(false);
      setSelectedRequest(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    try {
      setActionLoading(true);
      await api.put(`/books/requests/reject/${selectedRequest._id}`, { reason: rejectReason });
      fetchPendingRequests();
      setShowRejectModal(false);
      setSelectedRequest(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card book-requests-card p-4">
      <h6 className="section-heading mb-3">
        <i className="fa-solid fa-inbox me-2"></i>
        Book Requests
      </h6>

      {loading ? (
        <div className="text-center py-4">Loading requests...</div>
      ) : (
        <>
          {/* ================= COLUMN TOGGLE ================= */}
          <div className="d-flex justify-content-end mb-3 mt-md-0 mt-3">
            <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
          </div>

          {/* ================= DESKTOP VIEW ================= */}
          <div className="d-none d-md-block table-wrapper">
            <table className="table table-bordered align-middle fixed-table">
              <thead className="table-header">
                <tr>
                  {visibleColumns.requester && <th>Requester</th>}
                  {visibleColumns.book && <th>Book</th>}
                  {visibleColumns.requestDate && <th>Request Date</th>}
                  {visibleColumns.type && <th>Type</th>}
                  {visibleColumns.action && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {bookRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No pending requests
                    </td>
                  </tr>
                ) : (
                  bookRequests.map((req) => (
                    <tr key={req._id}>
                      {visibleColumns.requester && (
                        <td>
                          <strong>{req.userId?.fullName || req.userId?.name || "Unknown"}</strong>
                          <br />
                          <small className="text-muted">
                            {req.userId?.email || ""}
                          </small>
                        </td>
                      )}

                      {visibleColumns.book && (
                        <td>
                          <strong>{req.bookId?.title || "Unknown Book"}</strong>
                          <br />
                          <small className="text-muted">
                            Accession No: {req.bookId?.accessionNumber}
                          </small>
                        </td>
                      )}

                      {visibleColumns.requestDate && <td>{new Date(req.createdAt).toLocaleDateString()}</td>}

                      {visibleColumns.type && (
                        <td>
                          <span className="badge bg-primary text-capitalize">
                            {req.userId?.role || "user"}
                          </span>
                        </td>
                      )}

                      {visibleColumns.action && (
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleIssue(req)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRejectClick(req)}
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE VIEW ================= */}
          <div className="d-md-none">
            {bookRequests.length === 0 && (
              <p className="text-muted text-center">No pending requests</p>
            )}

            {bookRequests.map((req) => (
              <div key={req._id} className="request-card mb-3 p-3 border rounded shadow-sm">
                <div className="request-row">
                  <span className="label fw-bold">Requester:</span>
                  <span>{req.userId?.fullName || req.userId?.name}</span>
                </div>

                <div className="request-row mt-1">
                  <span className="label fw-bold">Role:</span>
                  <span className="badge bg-secondary text-capitalize">{req.userId?.role}</span>
                </div>

                <div className="request-row mt-1">
                  <span className="label fw-bold">Book:</span>
                  <span>{req.bookId?.title}</span>
                </div>

                <div className="request-row mt-1">
                  <span className="label fw-bold">Accession No:</span>
                  <span>
                    <strong>{req.bookId?.accessionNumber}</strong>
                  </span>
                </div>

                <div className="request-row mt-1">
                  <span className="label fw-bold">Requested On:</span>
                  <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="text-end mt-3">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleIssue(req)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRejectClick(req)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= CONFIRM ISSUE MODAL ================= */}
      {showConfirmModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content p-4 border rounded shadow">
              <h6>Confirm Submitting Request</h6>

              <p>
                Issue <strong>{selectedRequest?.bookId?.title}</strong> to{" "}
                <strong>
                  {selectedRequest?.userId?.fullName || selectedRequest?.userId?.name}
                </strong>
                ?
              </p>

              <p className="text-muted small">Due date rules apply based on user role.</p>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={confirmIssue}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Approving..." : "Confirm Issue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REJECT MODAL ================= */}
      {showRejectModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content p-4 border rounded shadow">
              <h6>Reject Request</h6>

              <p>
                Reject request for <strong>{selectedRequest?.bookId?.title}</strong>?
              </p>

              <div className="mb-3">
                <label className="form-label">Reason for rejection (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={confirmReject}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRequests;
