import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/homepage/Home.jsx";

/* Student */
import DashboardHome from "./pages/student/DashboardHome/DashboardHome.jsx";
import StudentDashboardLayout from "./pages/student/studentDashboardLayout/StudentDashboardLayout.jsx";
import BrowseBooks from "./pages/student/browseBooks/BrowseBooks.jsx";
import StudentIssuedBooks from "./pages/student/studentIssuedBooks/StudentIssuedBooks.jsx";
import MyRequests from "./pages/student/myRequests/MyRequests.jsx";
import Profile from "./pages/student/profile/Profile.jsx";

/* Librarian */
import LibrarianDashboardLayout from "./pages/librarian/librarianDashboardLayout/LibrarianDashboardLayout.jsx";
import ManageBooksLayout from "./pages/librarian/manageBookLayout/ManageBooksLayout.jsx";
import AddBooks from "./pages/librarian/manageBookLayout/addBooks/AddBooks.jsx";
import DeleteBooks from "./pages/librarian/manageBookLayout/deleteBooks/DeleteBooks.jsx";
import SearchBooks from "./pages/librarian/manageBookLayout/searchBooks/SearchBooks.jsx";
import DeletedBooks from "./pages/librarian/manageBookLayout/deletedBooks/DeletedBooks.jsx";
import LibrarianDashboardHome from "./pages/librarian/librarianDashboardHome/LibrarianDashboardHome.jsx";
import LibrarianProfile from "./pages/librarian/librarianProfile/LibrarianProfile.jsx";
import IssueBooksLayout from "./pages/librarian/issueBooksLayout/IssueBooksLayout.jsx";
import BookRequests from "./pages/librarian/issueBooksLayout/booksRequests/BookRequests.jsx";
import IssuedBooks from "./pages/librarian/issueBooksLayout/issuedBooks/IssuedBooks.jsx";
import ReturnedBooks from "./pages/librarian/issueBooksLayout/returnBooks/ReturnedBooks.jsx";

/* Admin */
import AdminDashboardLayout from "./pages/admin/layout/AdminDashboardLayout.jsx";
import Dashboard from "./pages/admin/pages/dashboard/Dashboard.jsx";
import Users from "./pages/admin/pages/users/Users.jsx";
import Books from "./pages/admin/pages/books/Books.jsx";
import Reports from "./pages/admin/pages/reports/Reports.jsx";
import ActivityLog from "./pages/admin/pages/activityLog/ActivityLog.jsx";
import SystemSettings from "./pages/admin/pages/systemSettings/SystemSettings.jsx";
import AdminProfile from "./pages/admin/pages/adminProfile/AdminProfile.jsx";
import PendingApprovals from "./pages/admin/pages/pendingApprovals/PendingApprovals.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="pending" element={<PendingApprovals />} />
        <Route path="books" element={<Books />} />
        <Route path="reports" element={<Reports />} />
        <Route path="activity-log" element={<ActivityLog />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Student */}
      <Route path="/student" element={<StudentDashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="books" element={<BrowseBooks />} />
        <Route path="issued" element={<StudentIssuedBooks />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Staff (Reuses Student Dashboard Structure) */}
      <Route path="/staff" element={<StudentDashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="books" element={<BrowseBooks />} />
        <Route path="issued" element={<StudentIssuedBooks />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Librarian */}
      <Route path="/librarian" element={<LibrarianDashboardLayout />}>
        <Route index element={<LibrarianDashboardHome />} />

        <Route path="books" element={<ManageBooksLayout />}>
          <Route path="add" element={<AddBooks />} />
          <Route path="delete" element={<DeleteBooks />} />
          <Route path="search" element={<SearchBooks />} />
          <Route path="deleted" element={<DeletedBooks />} />
        </Route>

        <Route path="issue" element={<IssueBooksLayout />}>
          <Route path="requests" element={<BookRequests />} />
          <Route path="issued" element={<IssuedBooks />} />
          <Route path="returned" element={<ReturnedBooks />} />
        </Route>

        <Route path="profile" element={<LibrarianProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
