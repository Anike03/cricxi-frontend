import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://cricxi.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS-related errors specifically
    if (error.code === "ERR_NETWORK" && error.message.includes("CORS")) {
      error.message = "CORS error detected. Please check your API configuration.";
    }
    
    // Handle other error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          break;
        case 403:
          // Handle forbidden access
          break;
        case 404:
          // Handle not found errors
          break;
        default:
          // Handle other HTTP errors
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;