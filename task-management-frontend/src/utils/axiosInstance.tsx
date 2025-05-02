// src/utils/axiosInstance.ts
import axios from "axios";

// Dynamically set baseURL without relying on env vars
const isProdFrontend =
    window.location.origin === "https://task-management-app-iox9.onrender.com";

const axiosInstance = axios.create({
    baseURL: isProdFrontend
        ? `https://task-management-app-iox9.onrender.com/api`
        : `http://localhost:8000/api`, // still use env for dev
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
