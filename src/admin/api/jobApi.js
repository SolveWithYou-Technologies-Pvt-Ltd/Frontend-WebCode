import axios from "axios";

const API_URL = "https://backend-code-k530rfj5r-solve-with-you.vercel.app/api/jobs";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("AdminLoginToken")}`,
  },
});

export const fetchPublicJobs = async () => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data.data;
};

export const fetchAdminJobs = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data.data;
};

export const fetchAdminJobById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const createAdminJob = async (jobData) => {
  const response = await axios.post(API_URL, jobData, getAuthConfig());
  return response.data;
};

export const updateAdminJob = async (id, jobData) => {
  const response = await axios.put(`${API_URL}/${id}`, jobData, getAuthConfig());
  return response.data;
};

export const toggleAdminJobStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, {}, getAuthConfig());
  return response.data;
};

export const deleteAdminJob = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};