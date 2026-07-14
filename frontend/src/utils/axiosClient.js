import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response?.status === 401) {
      console.warn("Unauthorized — login required");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
