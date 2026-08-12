import api from "./api";

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post(
      "/bookings",
      bookingData,
    );

    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get("/bookings/my");
    return response.data;
  },

  getBookingById: async (bookingId) => {
    const response = await api.get(
      `/bookings/${bookingId}`,
    );

    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.patch(
      `/bookings/${bookingId}/cancel`,
    );

    return response.data;
  },

  submitRating: async (bookingId, data) => {
    const response = await api.post(
      `/bookings/${bookingId}/rating`,
      data,
    );

    return response.data;
  },
};

export default bookingService;
