import axios from "axios";

const API_URL = "http://localhost:8000/api/clientprojects";

const getAuthConfig = () => {
  let token = localStorage.getItem("AdminLoginToken");
  
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const fetchEmployeesForAssignment = async () => {
  const response = await axios.get(`${API_URL}/employees`, getAuthConfig());
  return response.data.data;
};

export const fetchClientProjects = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data.data;
};

export const fetchClientProjectById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const fetchProjectByQuote = async (quoteId) => {
  const response = await axios.get(`${API_URL}/quote/${quoteId}`, getAuthConfig());
  return response.data;
};

export const updateProjectDetails = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClientProject = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};

export const updateClientProject = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
  return response.data;
};

export const updateProjectTaskStatus = async (projectId, taskId, status) => {
  const payload = typeof status === 'string' ? { status } : status;
  const response = await axios.patch(`${API_URL}/${projectId}/task/${taskId}`, payload, getAuthConfig());
  return response.data;
};

export const deleteClientProject = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};