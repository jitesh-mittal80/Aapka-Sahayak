import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🔥 BREAK 304 CACHE LOOP
  config.headers["Cache-Control"] = "no-cache";
  config.headers["Pragma"] = "no-cache";

  return config;
});

export default api;
