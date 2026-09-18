import api from "./api";

const register = async (formData) => {
  const response = await api.post("https://backendapi.solvewithyou.in/api/auth/register", formData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("https://backendapi.solvewithyou.in/api/auth/login", credentials);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("https://backendapi.solvewithyou.in/api/auth/me");
  return response.data;
};

export const authService = {
  register,
  login,
  getCurrentUser,
};
