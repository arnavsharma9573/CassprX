import axios from "axios";
import { NEXT_PUBLIC_BACKEND_URL } from "./envConfig";

const api = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  timeout: 25000, // 25s
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
