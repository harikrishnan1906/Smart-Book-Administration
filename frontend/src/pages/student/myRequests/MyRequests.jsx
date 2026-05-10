import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import useColumnVisibility from "../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../components/common/ColumnToggle/ColumnToggle";
import "./MyRequests.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "StudentMyRequestsColumns",
    {
      bookName: true,
      requestDate: true,
      status: true,
    }
  );

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await api.get('/books/requests/my');
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, []);

  return (
    <div className="my-requests">
      <h2 className="page-title">My Book Requests</h2>
      <p className="page-subtitle">Track the status of your book requests</p>

      {loading ? (
        <div className="text-center py-5">Loading requests...</div>
      ) : (
        <>
          {/* ================= COLUMN TOGGLE ================= */}
          <div className="d-flex justify-content-end mb-3">
            <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
          </div>

          <div className="table-responsive table-wrapper">
            <table className="requests-table w-100 table-bordered fixed-table">
              <thead>
                <tr>
                  {visibleColumns.bookName && <th>Book Name</th>}
                  {visibleColumns.requestDate && <th>Request Date</th>}
                  {visibleColumns.status && <th>Status</th>}
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">You have no book requests.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id}>
                    {visibleColumns.bookName && <td>{req.bookId?.title || "Unknown Book"}</td>}
                    {visibleColumns.requestDate && <td>{new Date(req.createdAt).toLocaleDateString()}</td>}
                    {visibleColumns.status && (
                      <td className={`status-${req.status.toLowerCase()}`}>
                        <span className="text-capitalize fw-bold">{req.status}</span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default MyRequests;
