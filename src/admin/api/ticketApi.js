import axios from "axios";

const API_URL = "https://backendapi.solvewithyou.in/api/tickets";

const getAuthConfig = () => {
  let token = localStorage.getItem("AdminLoginToken");  
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const fetchAdminTickets = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data.data;
};

export const fetchAdminTicketById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const updateAdminTicket = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
  return response.data;
};

export const updateAdminTicketStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthConfig());
  return response.data;
};

export const deleteAdminTicket = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};