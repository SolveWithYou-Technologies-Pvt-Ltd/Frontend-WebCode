import adminApi from "./adminApi";

const emptyPagination = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalRecords: 0,
};

export const fetchAdminClients = async (filters = {}) => {
  const response = await adminApi.get("/clients", {
    params: filters,
  });
  const data = response.data?.data || {};
  return {
    clients: data.clients || [],
    pagination: data.pagination || emptyPagination,
  };
};

export const createAdminClient = async (clientData) => {
  const response = await adminApi.post("/clients", clientData);
  return response.data?.data?.client || null;
};

export const fetchAdminClientById = async (id) => {
  const response = await adminApi.get(`/clients/${id}`);
  return response.data?.data?.client || null;
};

export const updateAdminClient = async (id, clientData) => {
  const response = await adminApi.put(`/clients/${id}`, clientData);
  return response.data?.data?.client || null;
};

export const changeClientStatus = async (id) => {
  const response = await adminApi.patch(`/clients/${id}/status`);
  return response.data?.data?.client || null;
};

export const removeAdminClient = async (id) => {
  const response = await adminApi.delete(`/clients/${id}`);
  return response.data;
};