import axios from "axios";

const API_URL = "https://backend-code-k530rfj5r-solve-with-you.vercel.app/api/services";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("AdminLoginToken")}`,
  },
});

export const fetchPublicServices = async () => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data.data;
};

export const fetchAdminServices = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data.data;
};

export const fetchAdminServiceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const createAdminService = async (serviceData) => {
  const response = await axios.post(API_URL, serviceData, getAuthConfig());
  return response.data;
};

export const updateAdminService = async (id, serviceData) => {
  const response = await axios.put(`${API_URL}/${id}`, serviceData, getAuthConfig());
  return response.data;
};

export const toggleAdminServiceStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, {}, getAuthConfig());
  return response.data;
};

export const deleteAdminService = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};