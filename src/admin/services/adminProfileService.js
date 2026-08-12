import adminApi from "../api/adminApi";

export const updateMyAdminProfile = async (
  profileData
) => {
  const response = await adminApi.patch(
    "/auth/profile",
    profileData
  );

  return (
    response.data?.data?.profile ||
    null
  );
};

export const uploadMyAdminProfilePicture =
  async (profileImage) => {
    const formData =
      new FormData();

    formData.append(
      "profileImage",
      profileImage
    );

    /*
      Do not manually set Content-Type. Axios/browser
      adds the required multipart boundary.
    */
    const response =
      await adminApi.patch(
        "/auth/profile-picture",
        formData
      );

    return (
      response.data?.data
        ?.profile || null
    );
  };
