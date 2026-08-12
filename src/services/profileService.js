import api from "./api";

export const profileService = {
  updateProfile: async (profileData) => {
    const response = await api.put("/auth/profile", profileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
