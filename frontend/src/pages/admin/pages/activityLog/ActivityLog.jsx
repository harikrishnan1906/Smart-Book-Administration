import { useEffect, useState } from "react";
import api from "../../../../services/api";
import "./ActivityLog.css";

const ActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/activity-logs');
      setActivityLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch activity logs", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "user":
        return "fa-user-check";
      case "security":
        return "fa-shield-halved";
      case "book":
        return "fa-book";
      case "system":
        return "fa-gear";
      default:
        return "fa-circle-info";
    }
  };

  return (
    <>
      <h4 className="mb-4">Activity Log</h4>

      <div className="card shadow-sm">
        <ul className="list-group list-group-flush">
          {loading ? (
            <li className="list-group-item text-center text-muted py-4">
              Loading activity logs...
            </li>
          ) : activityLogs.length === 0 ? (
            <li className="list-group-item text-center text-muted py-4">
              No activity recorded yet
            </li>
          ) : (
            activityLogs.map((log) => (
              <li
                className="list-group-item d-flex align-items-start gap-3 py-3"
                key={log._id}
              >
                <div className="log-icon bg-light rounded text-primary p-2">
                  <i className={`fa-solid ${getIcon(log.type)} fa-lg`}></i>
                </div>

                <div className="flex-grow-1">
                  <div className="fw-semibold">{log.action}</div>
                  <div className="text-muted small">{log.target}</div>
                </div>

                <div className="text-muted small">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default ActivityLog;
