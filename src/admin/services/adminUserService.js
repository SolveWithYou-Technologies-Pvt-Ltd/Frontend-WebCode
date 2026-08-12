import adminApi from "../api/adminApi";

const roleEndpoint = (role) => {
  return role === "admin"
    ? "admins"
    : "employees";
};


export const getTeamTree = async () => {
  const response = await adminApi.get(
    "/users/team-tree"
  );

  return {
    tree:
      response.data?.data?.tree || [],
    summary:
      response.data?.data?.summary || {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        superadmins: 0,
        admins: 0,
        employees: 0,
      },
  };
};

export const getManagedUsers = async (
  role,
  filters = {}
) => {
  const response = await adminApi.get(
    `/users/${roleEndpoint(role)}`,
    {
      params: filters,
    }
  );

  const data =
    response.data?.data || {};

  return {
    users: data.users || [],

    pagination:
      data.pagination || {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0,
        firstRecord: 0,
        lastRecord: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
  };
};

export const getManagedUser = async (
  role,
  userId
) => {
  const response = await adminApi.get(
    `/users/${roleEndpoint(role)}/${userId}`
  );

  return response.data?.data?.user;
};

export const getReportingManagers = async (
  excludeUserId = null
) => {
  const response = await adminApi.get(
    "/users/reporting-managers",
    {
      params: excludeUserId
        ? {
            excludeUserId,
          }
        : {},
    }
  );

  return response.data?.data?.managers || [];
};

export const createManagedUser = async (
  role,
  formData
) => {
  const response = await adminApi.post(
    `/users/${roleEndpoint(role)}`,
    formData
  );

  return response.data?.data?.user;
};

export const editManagedUser = async (
  role,
  userId,
  formData
) => {
  const response = await adminApi.patch(
    `/users/${roleEndpoint(role)}/${userId}`,
    formData
  );

  return response.data?.data?.user;
};

export const saveManagedUserPermissions =
  async (role, userId, permissions) => {
    const response = await adminApi.patch(
      `/users/${roleEndpoint(
        role
      )}/${userId}/permissions`,
      {
        permissions,
      }
    );

    return response.data?.data?.user;
  };

export const changeManagedUserStatus =
  async (role, userId, isActive) => {
    const response = await adminApi.patch(
      `/users/${roleEndpoint(
        role
      )}/${userId}/status`,
      {
        isActive,
      }
    );

    return response.data?.data;
  };

export const deleteManagedUser = async (
  role,
  userId
) => {
  const response = await adminApi.delete(
    `/users/${roleEndpoint(role)}/${userId}`
  );

  return response.data?.data;
};

export const changeManagedUserRole =
  async (
    currentRole,
    userId,
    newRole
  ) => {
    const response =
      await adminApi.patch(
        `/users/${roleEndpoint(
          currentRole
        )}/${userId}/role`,
        {
          newRole,
        }
      );

    return response.data?.data;
  };

