import { useState, useEffect } from "react";
import api from "../../../../services/api";
import useColumnVisibility from "../../../../hooks/useColumnVisibility";
import ColumnToggle from "../../../../components/common/ColumnToggle/ColumnToggle";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Reports.css";

const reportTypes = [
  { id: "issued", label: "Books Issued", type: "bar" },
  { id: "books-added", label: "Books Added", type: "line" },
  { id: "fines", label: "Fine Collection", type: "bar" },
  { id: "most-issued", label: "Most Issued Books", type: "bar-horizontal" },
  { id: "usage", label: "Staff vs Student Usage", type: "pie" },
  { id: "damaged", label: "Damaged Books", type: "bar" },
  { id: "overdue", label: "Overdue Books", type: "pie" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("issued");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Setup Column Visibility custom hook
  const [visibleColumns, toggleColumn] = useColumnVisibility(
    "AdminReportsColumns",
    {
      issueDate: true,
      bookTitle: true,
      user: true,
      status: true,
      purchaseYear: true,
      accessionNo: true,
      author: true,
      publication: true,
      price: true,
      department: true,
      returnDate: true,
      fineAmt: true,
      updatedAt: true,
      reason: true,
    }
  );

  const currentYear = new Date().getFullYear();
  // Expanded years to cover backwards seeding to 1980
  const years = Array.from({ length: currentYear - 1980 + 3 }, (_, i) => currentYear + 2 - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const fetchReport = async () => {
    try {
      setLoading(true);
      let query = `?`;
      if (filterYear) query += `year=${filterYear}&`;
      if (filterMonth) query += `month=${filterMonth}`;

      const res = await api.get(`/reports/${selectedReport}${query}`);
      setChartData(res.data.chartData || []);
      setTableData(res.data.tableData || []);
    } catch (err) {
      console.error("Failed to fetch report data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedReport]);

  const handleExportCSV = () => {
    if (tableData.length === 0) return alert("No data to export!");

    // Helper to format date
    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

    let csvRows = [];

    if (selectedReport === "issued") {
      let headers = [];
      if (visibleColumns.issueDate) headers.push("Issue Date");
      if (visibleColumns.bookTitle) headers.push("Book Title");
      if (visibleColumns.user) headers.push("User");
      if (visibleColumns.status) headers.push("Status");
      csvRows.push(headers.join(","));

      tableData.forEach((row) => {
        let rowData = [];
        if (visibleColumns.issueDate) rowData.push(`"${formatDate(row.issueDate)}"`);
        if (visibleColumns.bookTitle) rowData.push(`"${row.bookId?.title || "N/A"}"`);
        if (visibleColumns.user) rowData.push(`"${row.userId?.fullName || "Unknown"} (${row.userId?.role || "N/A"})"`);
        if (visibleColumns.status) rowData.push(`"${row.isReturned ? "Returned" : "Active"}"`);
        csvRows.push(rowData.join(","));
      });
    } else if (selectedReport === "books-added") {
      let headers = [];
      if (visibleColumns.purchaseYear) headers.push("Purchase Year");
      if (visibleColumns.accessionNo) headers.push("Accession No");
      if (visibleColumns.bookTitle) headers.push("Title");
      if (visibleColumns.author) headers.push("Author");
      if (visibleColumns.publication) headers.push("Publication");
      if (visibleColumns.price) headers.push("Price");
      if (visibleColumns.department) headers.push("Department");
      if (visibleColumns.status) headers.push("Status");
      csvRows.push(headers.join(","));

      tableData.forEach((row) => {
        let rowData = [];
        if (visibleColumns.purchaseYear) rowData.push(`"${row.purchaseYear || "N/A"}"`);
        if (visibleColumns.accessionNo) rowData.push(`"${row.accessionNumber}"`);
        if (visibleColumns.bookTitle) rowData.push(`"${row.title}"`);
        if (visibleColumns.author) rowData.push(`"${row.author || "N/A"}"`);
        if (visibleColumns.publication) rowData.push(`"${row.publication || "N/A"}"`);
        if (visibleColumns.price) rowData.push(`"${row.price || 0}"`);
        if (visibleColumns.department) rowData.push(`"${row.departmentId?.name || "N/A"}"`);
        if (visibleColumns.status) rowData.push(`"${row.status || "available"}"`);
        csvRows.push(rowData.join(","));
      });
    } else if (selectedReport === "fines") {
      let headers = [];
      if (visibleColumns.returnDate) headers.push("Return Date");
      if (visibleColumns.user) headers.push("User");
      if (visibleColumns.bookTitle) headers.push("Book");
      if (visibleColumns.fineAmt) headers.push("Fine Amt");
      if (visibleColumns.status) headers.push("Status");
      csvRows.push(headers.join(","));

      tableData.forEach((row) => {
        let rowData = [];
        if (visibleColumns.returnDate) rowData.push(`"${formatDate(row.returnDate)}"`);
        if (visibleColumns.user) rowData.push(`"${row.userId?.fullName || "Unknown"}"`);
        if (visibleColumns.bookTitle) rowData.push(`"${row.bookId?.title || "N/A"}"`);
        if (visibleColumns.fineAmt) rowData.push(`"${row.fineAmount}"`);
        if (visibleColumns.status) rowData.push(`"${row.fineCollected ? "Collected" : "Pending"}"`);
        csvRows.push(rowData.join(","));
      });
    } else if (selectedReport === "damaged") {
      let headers = [];
      if (visibleColumns.updatedAt) headers.push("Updated At");
      if (visibleColumns.bookTitle) headers.push("Book Title");
      if (visibleColumns.accessionNo) headers.push("Accession No");
      if (visibleColumns.reason) headers.push("Reason");
      csvRows.push(headers.join(","));

      tableData.forEach((row) => {
        let rowData = [];
        if (visibleColumns.updatedAt) rowData.push(`"${formatDate(row.updatedAt)}"`);
        if (visibleColumns.bookTitle) rowData.push(`"${row.title}"`);
        if (visibleColumns.accessionNo) rowData.push(`"${row.accessionNumber}"`);
        if (visibleColumns.reason) rowData.push(`"${row.damagedReason || "Not specified"}"`);
        csvRows.push(rowData.join(","));
      });
    } else {
      // Generic fallback for any other reports
      const flattenObject = (obj) => {
        let flat = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            if (value.name) flat[key] = value.name;
            else if (value.title) flat[key] = value.title;
            else if (value.fullName) flat[key] = value.fullName;
            else flat[key] = JSON.stringify(value);
          } else {
            flat[key] = value;
          }
        }
        return flat;
      };

      const flatTableData = tableData.map(flattenObject);
      const headers = Object.keys(flatTableData[0] || {}).filter((k) => k !== "__v" && k !== "_id" && k !== "password");

      csvRows.push(headers.join(","));

      flatTableData.forEach((row) => {
        const rowData = headers.map((header) => `"${(row[header] || "").toString().replace(/"/g, '""')}"`);
        csvRows.push(rowData.join(","));
      });
    }

    // Add BOM for Excel UTF-8 display correctly
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvRows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `report_${selectedReport}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderChart = () => {
    const reportTypeConf = reportTypes.find((r) => r.id === selectedReport);
    if (!reportTypeConf) return null;

    if (chartData.length === 0) {
      return <div className="text-center py-5 text-muted">No chart data available for this range.</div>;
    }

    if (reportTypeConf.type === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (reportTypeConf.type === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Count" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (reportTypeConf.type === "bar-horizontal") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Default to Bar (vertical)
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedReport === "fines" ? (
            <>
              <Bar dataKey="total" fill="#FFBB28" name="Total Fine (₹)" />
              <Bar dataKey="collected" fill="#00C49F" name="Collected (₹)" />
            </>
          ) : (
            <Bar dataKey="value" fill="#8884d8" name="Count" />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderTable = () => {
    if (tableData.length === 0) {
      return <div className="text-center py-4 text-muted">No records found.</div>;
    }

    if (selectedReport === "issued") {
      return (
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {visibleColumns.issueDate && <th>Issue Date</th>}
              {visibleColumns.bookTitle && <th>Book Title</th>}
              {visibleColumns.user && <th>User</th>}
              {visibleColumns.status && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {visibleColumns.issueDate && <td>{new Date(row.issueDate).toLocaleDateString()}</td>}
                {visibleColumns.bookTitle && <td>{row.bookId?.title || "N/A"}</td>}
                {visibleColumns.user && <td>{row.userId?.fullName || "Unknown"} ({row.userId?.role || "N/A"})</td>}
                {visibleColumns.status && <td>{row.isReturned ? "Returned" : "Active"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === "books-added") {
      return (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                {visibleColumns.purchaseYear && <th>Purchase Year</th>}
                {visibleColumns.accessionNo && <th>Accession No</th>}
                {visibleColumns.bookTitle && <th>Title</th>}
                {visibleColumns.author && <th>Author</th>}
                {visibleColumns.publication && <th>Publication</th>}
                {visibleColumns.price && <th>Price</th>}
                {visibleColumns.department && <th>Department</th>}
                {visibleColumns.status && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  {visibleColumns.purchaseYear && <td className="fw-bold">{row.purchaseYear || "N/A"}</td>}
                  {visibleColumns.accessionNo && <td>{row.accessionNumber}</td>}
                  {visibleColumns.bookTitle && <td>{row.title}</td>}
                  {visibleColumns.author && <td>{row.author || "N/A"}</td>}
                  {visibleColumns.publication && <td>{row.publication || "N/A"}</td>}
                  {visibleColumns.price && <td>₹{row.price || 0}</td>}
                  {visibleColumns.department && <td>{row.departmentId?.name || "N/A"}</td>}
                  {visibleColumns.status && <td><span className="badge bg-secondary text-capitalize">{row.status || "available"}</span></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedReport === "fines") {
      return (
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {visibleColumns.returnDate && <th>Return Date</th>}
              {visibleColumns.user && <th>User</th>}
              {visibleColumns.bookTitle && <th>Book</th>}
              {visibleColumns.fineAmt && <th>Fine Amt (₹)</th>}
              {visibleColumns.status && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {visibleColumns.returnDate && <td>{new Date(row.returnDate).toLocaleDateString()}</td>}
                {visibleColumns.user && <td>{row.userId?.fullName || "Unknown"}</td>}
                {visibleColumns.bookTitle && <td>{row.bookId?.title || "N/A"}</td>}
                {visibleColumns.fineAmt && <td className="fw-bold text-danger">{row.fineAmount}</td>}
                {visibleColumns.status && (
                  <td>
                    {row.fineCollected ? (
                      <span className="badge bg-success">Collected</span>
                    ) : (
                      <span className="badge bg-warning">Pending</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === "damaged") {
      return (
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {visibleColumns.updatedAt && <th>Updated At</th>}
              {visibleColumns.bookTitle && <th>Book Title</th>}
              {visibleColumns.accessionNo && <th>Accession No</th>}
              {visibleColumns.reason && <th>Reason</th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {visibleColumns.updatedAt && <td>{new Date(row.updatedAt).toLocaleDateString()}</td>}
                {visibleColumns.bookTitle && <td>{row.title}</td>}
                {visibleColumns.accessionNo && <td>{row.accessionNumber}</td>}
                {visibleColumns.reason && <td className="text-danger">{row.damagedReason || "Not specified"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Generic fallback map
    const headers = Object.keys(tableData[0] || {}).filter(k => k !== '__v' && k !== 'password' && !k.startsWith('_'));
    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {headers.map((h, i) => <th key={i} className="text-capitalize">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                {headers.map((h, j) => {
                  let val = row[h];
                  if (typeof val === 'object' && val !== null) val = val.title || val.fullName || val.name || "Object";
                  return <td key={j}>{String(val)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="reports-container">
      <h4 className="mb-4">Reports & Analytics</h4>

      <div className="card shadow-sm p-4 mb-4 filter-section">
        <h6 className="text-muted text-uppercase mb-3 fw-bold">Report Settings</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Report Type</label>
            <select
              className="form-select"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              {reportTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">Year Filter</label>
            <select
              className="form-select"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">All Time</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">Month Filter</label>
            <select
              className="form-select"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={fetchReport} disabled={loading}>
              <i className="fa-solid fa-filter me-2"></i> Apply
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Generating Report...</p>
        </div>
      ) : (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold">
                {reportTypes.find((r) => r.id === selectedReport)?.label} Chart
              </h5>
              <div className="mt-4">{renderChart()}</div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="mb-0 fw-bold">Data Preview</h6>
              <div className="d-flex gap-2">
                <ColumnToggle columns={visibleColumns} onToggle={toggleColumn} />
                <button className="btn btn-sm btn-outline-success" onClick={handleExportCSV}>
                  <i className="fa-solid fa-download me-2"></i> Export CSV
                </button>
              </div>
            </div>
            <div className="card-body p-0">{renderTable()}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
