import axios from "axios";

// Create an instance of axios with default settings
const axiosInstance = axios.create({
  baseURL: "http://localhost:2030", // Set the base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login page)
      localStorage.removeItem("token"); // Remove token if unauthorized
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
