import axios from "axios";

import {
  getAdminToken,
  removeAdminToken,
} from "./adminToken";

const apiBaseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const adminApi = axios.create({
  baseURL: `${apiBaseUrl}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken();

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (
      status === 401 &&
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/register-superadmin")
    ) {
      removeAdminToken();
    }

    return Promise.reject(error);
  }
);

export default adminApi;
