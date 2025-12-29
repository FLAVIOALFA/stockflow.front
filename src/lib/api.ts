import axios from 'axios';

// You might want to move this to an environment variable later
const STRAPI_URL = "http://localhost:1337/api";

export const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("stockflow_jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear storage, redirect to login)
      // For now, we just reject the error, but you could emit an event here
      localStorage.removeItem("stockflow_jwt");
      localStorage.removeItem("stockflow_user");
      
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login') {
          window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);
