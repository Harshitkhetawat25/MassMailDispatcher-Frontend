import axios from "axios";
import { API_URL } from "../../constants/config";

// Create a separate axios instance for refresh calls to avoid interceptor loops
const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Best-practice: Only refresh for protected endpoints, never for public/auth endpoints
const isProtectedEndpoint = (url) => {
  // Add all endpoints that require authentication here
  const protectedPatterns = [
    "/api/email/",
    "/api/template/",
    "/api/upload/",
    "/api/user/update",
    "/api/mail/",
    "/api/ai/",
    // Add more as needed
  ];
  return protectedPatterns.some((pattern) => url?.includes(pattern));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Only refresh for protected endpoints, not for public/auth endpoints
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      isProtectedEndpoint(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await refreshApi.post("/api/auth/refresh-token", {});
        processQueue(null, res.data.accessToken);
        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        // Only redirect if we're not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
