import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.API_URL || "http://localhost:5000/api" });
export default api;
