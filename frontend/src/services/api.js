import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Add a request interceptor to attach the Authorization header
api.interceptors.request.use(
  (config) => {
    // We'll store the token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is an unauthorized access, we can clear the token and log out the user
    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('token');
    //   window.location.href = '/';
    // }
    return Promise.reject(error);
  }
);

export default api;
