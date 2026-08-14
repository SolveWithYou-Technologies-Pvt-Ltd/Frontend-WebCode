import axios from "axios";

const API_URL = "https://backend-code-k530rfj5r-solve-with-you.vercel.app/api/proposals";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("doctorAdminToken") || localStorage.getItem("UserAuthToken")}`,
  },
});

export const fetchAdminProposals = async (search = "", status = "All") => {
  const response = await axios.get(`${API_URL}?search=${search}&status=${status}`, getAuthConfig());
  return response.data.data;
};

export const fetchAdminProposalById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const createAdminProposal = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};

export const fetchProposalByQuote = async (quoteId) => {
  const response = await axios.get(`${API_URL}/quote/${quoteId}`, getAuthConfig());
  return response.data;
};

export const updateProposalStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthConfig());
  return response.data;
};

export const updateAdminProposal = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
  return response.data;
};

export const deleteAdminProposal = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};