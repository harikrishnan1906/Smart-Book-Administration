import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const DataContext = createContext();

const DataProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'student' | 'librarian'
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Maintain dummy states as empty arrays so other components don't crash yet
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [librarians, setLibrarians] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [admin, setAdmin] = useState(null);

  // When token changes, store it (or if null, remove it)
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Optionally fetch user profile on load if token exists
  // For now we will rely on login response to set user info, or add a /me endpoint later if backend has one

  const loginUser = async (email, password, loginRole) => {
    try {
      const endpoint = loginRole === "admin" ? "/auth/admin/login" : "/auth/login";
      const response = await api.post(endpoint, { email, password });
      
      const { token, role, ...userData } = response.data;
      
      setToken(token);
      setRole(role || loginRole); // Backend usually sends role, fallback to loginRole
      setUser(userData);
      
      return { success: true, role: role || loginRole };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Invalid credentials" 
      };
    }
  };

  const logoutUser = async () => {
    // Instantly clear local state to prevent React Router redirect loops
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        user, setUser,
        role, setRole,
        token, setToken,
        loginUser,
        logoutUser,
        books, setBooks,
        students, setStudents,
        staff, setStaff,
        librarians, setLibrarians,
        activityLogs, setActivityLogs,
        systemSettings, setSystemSettings,
        admin, setAdmin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
