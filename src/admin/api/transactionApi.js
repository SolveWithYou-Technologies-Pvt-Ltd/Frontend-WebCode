import axios from "axios";

const API_URL = "http://localhost:8000/api/transactions";

const getAuthConfig = () => {
  let token = localStorage.getItem("AdminLoginToken");
  
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const fetchTransactions = async (startDate, endDate) => {
  let url = API_URL;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  } else if (startDate) {
    url += `?startDate=${startDate}`;
  } else if (endDate) {
    url += `?endDate=${endDate}`;
  }
  const response = await axios.get(url, getAuthConfig());
  return response.data.data;
};

export const fetchTransactionStats = async (startDate, endDate) => {
  let url = `${API_URL}/stats`;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  } else if (startDate) {
    url += `?startDate=${startDate}`;
  } else if (endDate) {
    url += `?endDate=${endDate}`;
  }
  const response = await axios.get(url, getAuthConfig());
  return response.data.data;
};

export const fetchTransactionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data.data;
};

export const createTransaction = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};