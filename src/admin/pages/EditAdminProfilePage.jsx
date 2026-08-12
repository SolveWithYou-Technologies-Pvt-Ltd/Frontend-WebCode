import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import AdminProfileImageCropper from "../components/AdminProfileImageCropper";
import EmployeeProfileFields from "../components/EmployeeProfileFields";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  mapUserToEmployeeProfile,
} from "../utils/employeeProfileForm";

import {
  saveAdminProfileSnapshot,
  useSyncedAdminProfile,
} from "../utils/adminProfileSync";

import {
  updateMyAdminProfile,
  uploadMyAdminProfilePicture,
} from "../services/adminProfileService";

const EditAdminProfilePage = () => {
  const navigate = useNavigate();

  const {
    adminProfile,
    refreshAdminProfile,
  } = useAdminAuth();

  const displayProfile =
    useSyncedAdminProfile(
      adminProfile
    );

  const [
    formData,
    setFormData,
  ] = useState({
    ...mapUserToEmployeeProfile(
      displayProfile
    ),

    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    uploadingPhoto,
    setUploadingPhoto,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    photoMessage,
    setPhotoMessage,
  ] = useState("");

  useEffect(() => {
    setFormData({
      ...mapUserToEmployeeProfile(
        displayProfile
      ),

      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [displayProfile]);

  const updateField = (
    fieldName,
    value
  ) => {
    setFormData(
      (currentData) => ({
        ...currentData,
        [fieldName]: value,
      })
    );
  };

  const updateNestedField = (
    sectionName,
    fieldName,
    value
  ) => {
    setFormData(
      (currentData) => ({
        ...currentData,

        [sectionName]: {
          ...currentData[
            sectionName
          ],

          [fieldName]: value,
        },
      })
    );
  };

  const handlePhotoUpload =
    async (croppedFile) => {
      setUploadingPhoto(true);
      setPhotoMessage("");
      setError("");

      try {
        const updatedProfile =
          await uploadMyAdminProfilePicture(
            croppedFile
          );

        if (updatedProfile) {
          saveAdminProfileSnapshot(
            updatedProfile
          );
        }

        if (
          typeof refreshAdminProfile ===
          "function"
        ) {
          await refreshAdminProfile();
        }

        setPhotoMessage(
          "Profile picture updated successfully"
        );
      } catch (requestError) {
        const message =
          requestError.response?.data
            ?.message ||
          "Unable to upload profile picture";

        setError(message);

        throw new Error(message);
      } finally {
        setUploadingPhoto(false);
      }
    };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();
    setError("");
    setPhotoMessage("");

    if (
      formData.newPassword &&
      formData.newPassword !==
        formData.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match"
      );

      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,

        email:
          formData.email
            .trim()
            .toLowerCase(),
      };

      delete payload.confirmPassword;
      delete payload.employeeCode;

      if (!formData.newPassword) {
        delete payload.newPassword;
        delete payload.currentPassword;
      }

      const updatedProfile =
        await updateMyAdminProfile(
          payload
        );

      if (updatedProfile) {
        saveAdminProfileSnapshot(
          updatedProfile
        );
      }

      if (
        typeof refreshAdminProfile ===
        "function"
      ) {
        await refreshAdminProfile();
      }

      navigate(
        "/admin/profile",
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          "Unable to update profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Edit My Profile
        </h1>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Update your profile photo and account information.
        </p>
      </div>

      <div className="mb-4">
        <AdminProfileImageCropper
          currentImage={
            displayProfile?.profileImage
          }
          fullName={
            displayProfile?.fullName
          }
          uploading={
            uploadingPhoto
          }
          onUpload={
            handlePhotoUpload
          }
        />

        {photoMessage && (
          <p className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] text-emerald-700 sm:text-xs">
            {photoMessage}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-3 sm:p-5"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
            {error}
          </div>
        )}

        <EmployeeProfileFields
          formData={formData}
          onChange={updateField}
          onNestedChange={
            updateNestedField
          }
        />

        <section className="grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Change Password
            </h2>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              Leave these fields empty to keep the existing password.
            </p>
          </div>

          <input
            type="password"
            value={
              formData.currentPassword
            }
            onChange={(event) =>
              updateField(
                "currentPassword",
                event.target.value
              )
            }
            placeholder="Current password"
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:text-sm"
          />

          <input
            type="password"
            value={
              formData.newPassword
            }
            onChange={(event) =>
              updateField(
                "newPassword",
                event.target.value
              )
            }
            minLength={6}
            placeholder="New password"
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:text-sm"
          />

          <input
            type="password"
            value={
              formData.confirmPassword
            }
            onChange={(event) =>
              updateField(
                "confirmPassword",
                event.target.value
              )
            }
            minLength={6}
            placeholder="Confirm new password"
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:col-span-2 sm:text-sm"
          />
        </section>

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/profile"
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              uploadingPhoto
            }
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 sm:text-sm"
          >
            {submitting
              ? "Saving..."
              : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminProfilePage;
