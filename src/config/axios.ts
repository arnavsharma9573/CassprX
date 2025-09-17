import axios from "axios";
import { BASE_URL } from "./envConfig";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15s
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] = "69420";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
