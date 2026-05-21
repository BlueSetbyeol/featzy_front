import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true, // required for Sanctum session cookies
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Fetch the Sanctum CSRF cookie before any state-mutating request.
 * Call this once before login/register.
 */
export async function initCsrf(): Promise<void> {
  await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

// Response interceptor — unwrap data and handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or not authenticated — redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Attaches CSRF token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }
  return config;
});

export default api;
