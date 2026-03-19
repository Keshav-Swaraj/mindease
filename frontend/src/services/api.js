import axios from "axios";

// Backend URL (FastAPI)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create an Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example function to make requests
export const getHealthStatus = async () => {
  const response = await API.get("/health");
  return response.data;
};

export default API;
