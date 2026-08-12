import api from "./api";

const doctorService = {
  getDoctors: async (params = {}) => {
    const response = await api.get("/doctors", {
      params,
    });

    return response.data;
  },

  getDoctorByCode: async (doctorCode) => {
    const response = await api.get("/doctors/details", {
      params: {
        doctorCode,
      },
    });

    return response.data;
  },

  getDoctorReviews: async (doctorCode) => {
    const response = await api.get("/doctors/reviews", {
      params: {
        doctorCode,
      },
    });

    return response.data;
  },

  getDoctorSlots: async (doctorCode, date) => {
    const response = await api.get("/doctors/slots", {
      params: {
        doctorCode,
        date,
      },
    });

    return response.data;
  },
};

export default doctorService;
