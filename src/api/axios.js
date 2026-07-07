import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) {
      toast.error("Server is unavailable");
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        // await api.post("/auth/refresh-token");

        // return api(originalRequest);

      } catch (err) {
        toast.error("Session Expired");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;