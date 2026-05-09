import axios from "axios";

const apiBase =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

export const api = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" },
  timeout: 20000
});
