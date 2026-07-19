import axios from "axios";

// In production, set VITE_API_URL in your hosting provider's environment
// variables (e.g. Vercel project settings) to your deployed backend URL.
// Locally, it falls back to your Flask dev server.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.msg;

    if (status === 401) {
      if (
        msg === "Token has expired" ||
        msg === "Missing Authorization Header" ||
        msg === "Not enough segments" ||
        msg === "Invalid header string"
      ) {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;