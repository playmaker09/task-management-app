// src/utils/axiosInstance.ts
import axios from "axios";

// Determine environment-specific API base URL
const isProd =
    window.location.origin === "https://task-management-app-iox9.onrender.com/";

const isProdFrontend =
    window.location.origin === "https://task-management-app-iox9.onrender.com";

const axiosInstance = axios.create({
    baseURL: isProdFrontend
        ? import.meta.env.VITE_API_PROD_URL
        : import.meta.env.VITE_API_DEV_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach token from localStorage if it exists
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
