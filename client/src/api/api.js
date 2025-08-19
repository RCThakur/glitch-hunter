// src/api/api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4001/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const guestLogin = () => API.post("/auth/guest");
