import adminApi from "../api/adminApi";

const emptyPagination = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalRecords: 0,
  firstRecord: 0,
  lastRecord: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const fetchAdminServices =
  async (filters = {}) => {
    const response =
      await adminApi.get(
        "/services",
        {
          params: filters,
        }
      );

    const data =
      response.data?.data || {};

    return {
      services:
        data.services || [],

      filters:
        data.filters || {
          categories: [],
          modes: [
            "Clinic",
            "Video",
            "Home Sample",
          ],
        },

      pagination:
        data.pagination ||
        emptyPagination,
    };
  };

export const fetchAdminService =
  async (serviceId) => {
    const response =
      await adminApi.get(
        `/services/${serviceId}`
      );

    return (
      response.data?.data
        ?.service || null
    );
  };

export const createAdminService =
  async (serviceData) => {
    const response =
      await adminApi.post(
        "/services",
        serviceData
      );

    return (
      response.data?.data
        ?.service || null
    );
  };

export const updateAdminService =
  async (
    serviceId,
    serviceData
  ) => {
    const response =
      await adminApi.patch(
        `/services/${serviceId}`,
        serviceData
      );

    return (
      response.data?.data
        ?.service || null
    );
  };

export const changeServiceStatus =
  async (
    serviceId,
    isActive
  ) => {
    const response =
      await adminApi.patch(
        `/services/${serviceId}/status`,
        {
          isActive,
        }
      );

    return (
      response.data?.data
        ?.service || null
    );
  };

export const removeAdminService =
  async (serviceId) => {
    const response =
      await adminApi.delete(
        `/services/${serviceId}`
      );

    return response.data?.data;
  };
