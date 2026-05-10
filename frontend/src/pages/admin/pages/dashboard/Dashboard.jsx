import { useState, useEffect } from "react";
import api from "../../../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    students: 0,
    staff: 0,
    librarians: 0,
    issued: 0,
    damaged: 0, // Assuming damaged is just a status check if applicable
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await api.get('/users/admin-stats');
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { label: "Total Books", value: stats.books, icon: "fa-book" },
    { label: "Students", value: stats.students, icon: "fa-user-graduate" },
    { label: "Staff", value: stats.staff, icon: "fa-user-tie" },
    { label: "Librarians", value: stats.librarians, icon: "fa-users" },
    { label: "Issued Books", value: stats.issued, icon: "fa-book-open" },
    {
      label: "Damaged Books",
      value: stats.damaged,
      icon: "fa-triangle-exclamation",
    },
  ];

  return (
    <>
      <h4 className="mb-4">Dashboard Overview</h4>

      {loading ? (
        <div className="text-center py-5">Loading statistics...</div>
      ) : (
        <div className="row g-4">
          {statItems.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div className="card stat-card shadow-sm h-100">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted mb-1 fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>{item.label}</p>
                    <h3 className="mb-0 fw-bold">{item.value}</h3>
                  </div>
                  <div className="stat-icon bg-light rounded-circle p-3 text-primary">
                    <i className={`fa-solid ${item.icon} fa-xl`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
