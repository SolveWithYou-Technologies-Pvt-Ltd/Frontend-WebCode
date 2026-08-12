import adminApi from "../api/adminApi";

export const getStaffUsers = async (filters = {}) => {
  const response = await adminApi.get("/users", {
    params: filters,
  });

  return response.data?.data?.users || [];
};

export const getStaffUser = async (userId) => {
  const response = await adminApi.get(`/users/${userId}`);

  return response.data?.data?.user;
};

export const getStaffForEdit = async (userId) => {
  const response = await adminApi.get(
    `/users/${userId}/edit`
  );

  return response.data?.data?.user;
};

export const getCreatePermissionOptions = async (role) => {
  const response = await adminApi.get(
    `/users/permission-options/${role}`
  );

  return response.data?.data?.permissions || [];
};

export const getStaffPermissionDetails = async (userId) => {
  const response = await adminApi.get(
    `/users/${userId}/permissions`
  );

  return {
    user: response.data?.data?.user,
    permissions:
      response.data?.data?.permissions || [],
  };
};

export const createStaffUser = async (formData) => {
  const response = await adminApi.post("/users", formData);

  return response.data?.data?.user;
};

export const updateStaffUser = async (
  userId,
  formData
) => {
  const response = await adminApi.patch(
    `/users/${userId}`,
    formData
  );

  return response.data?.data?.user;
};

export const updateStaffPermissions = async (
  userId,
  permissions
) => {
  const response = await adminApi.patch(
    `/users/${userId}/permissions`,
    {
      permissions,
    }
  );

  return response.data?.data?.user;
};

export const updateStaffStatus = async (
  userId,
  isActive
) => {
  const response = await adminApi.patch(
    `/users/${userId}/status`,
    {
      isActive,
    }
  );

  return response.data?.data?.user;
};

export const deleteStaffUser = async (userId) => {
  const response = await adminApi.delete(
    `/users/${userId}`
  );

  return response.data;
};
