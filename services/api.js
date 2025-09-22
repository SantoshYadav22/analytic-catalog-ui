  import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized: Redirecting to login...");
          break;
        case 500:
          console.error("Server error. Please try again later.");
          break;
        default:
          console.error(error.response.data?.message || "An error occurred");
      }
    } else if (error.request) {
      console.error("Network error. No response from server.");
    } else {
      console.error("Axios config error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
