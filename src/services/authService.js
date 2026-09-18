import api from "./api";

const register = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const authService = {
  register,
  login,
  getCurrentUser,
};
