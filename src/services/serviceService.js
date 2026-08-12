import api from "./api";

const serviceService = {
  getServices: async (params = {}) => {
    const response = await api.get("/services", {
      params,
    });

    return response.data;
  },

  getServiceByIdentifier: async (identifier) => {
    const response = await api.get(`/services/${identifier}`);
    return response.data;
  },
};

export default serviceService;
