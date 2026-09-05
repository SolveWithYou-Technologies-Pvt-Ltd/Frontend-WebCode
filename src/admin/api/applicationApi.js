import axios from "axios";

const API_URL = "https://backendapi.solvewithyou.in/api/applications";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("AdminLoginToken")}`,
  },
});

export const fetchApplications = async (params = {}) => {
  const config = {
    ...getAuthConfig(),
    params,
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

export const fetchUniqueAppliedRoles = async () => {
  const response = await axios.get(`${API_URL}/roles`, getAuthConfig());
  return response.data.data;
};

export const fetchApplicationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthConfig());
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};