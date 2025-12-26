import axios from "axios";
import { getToken } from "./auth";

// Create axios instance
const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // empty if using microservices
  headers: {
    "Content-Type": "application/json",
  },
//   timeout: 8000, // default 8 sec timeout globally
});

// Attach token to each request
Api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Ensure it includes "token " prefix only once
      config.headers.Authorization = token.startsWith("token ")
        ? token
        : `token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for centralized error handling
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request Timeout: ", error.message);
    } else if (error.response?.status === 401) {
      console.error("Unauthorized: Invalid or expired token");
      // You can auto-logout here if needed
      // localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default Api;
