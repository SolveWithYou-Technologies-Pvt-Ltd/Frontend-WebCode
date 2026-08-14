import axios from "axios";

const API_URL = "http://localhost:8000/api/quotes";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("AdminLoginToken")}`,
  },
});

export const fetchAdminQuotes = async (search = "", status = "All") => {
  const response = await axios.get(`${API_URL}?search=${search}&status=${status}`, getAuthConfig());
  return response.data.data;
};

export const fetchAdminQuoteById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const createAdminQuote = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};

export const updateAdminQuoteStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthConfig());
  return response.data;
};

export const updateAdminQuote = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
  return response.data;
};

export const deleteAdminQuote = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};