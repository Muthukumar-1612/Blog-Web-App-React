import axios from "axios";
import { store } from "./store";

const isProd = import.meta.env.VITE_ENV === "production";
const backend_URL = isProd ? import.meta.env.VITE_RENDER_BACKEND_URL : import.meta.env.VITE_LOCAL_BACKEND_URL;

const api = axios.create({
    baseURL: backend_URL,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token; // get JWT from Redux
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
