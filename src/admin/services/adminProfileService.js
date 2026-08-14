import adminApi from "../api/adminApi";

export const updateMyAdminProfile = async (profileData) => {
  const response = await adminApi.patch("/auth/profile", profileData);

  return response.data?.data?.profile || null;
};

export const uploadMyAdminProfilePicture = async (profileImage) => {
  const formData = new FormData();

  formData.append("profileImage", profileImage);

  const response = await adminApi.patch(
    "/auth/profile-picture",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data?.data?.profile || null;
};