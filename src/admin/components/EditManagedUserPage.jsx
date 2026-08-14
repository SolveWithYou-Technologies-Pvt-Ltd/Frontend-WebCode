import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import EmployeeProfileFields from "./EmployeeProfileFields";
import PermissionTable from "./PermissionTable";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  createPermissionObject,
  getAssignablePermissionMask,
  normalizePermissionObject,
} from "../config/permissionTable";

import {
  createEmptyEmployeeProfile,
  mapUserToEmployeeProfile,
} from "../utils/employeeProfileForm";

import {
  editManagedUser,
  getManagedUser,
  getReportingManagers,
} from "../services/adminUserService";

import {
  getRoleConfig,
} from "../utils/userManagement";

const EditManagedUserPage = ({
  role,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    adminProfile,
  } = useAdminAuth();

  const config =
    getRoleConfig(role);

  const allowedPermissions =
    useMemo(
      () =>
        getAssignablePermissionMask(
          adminProfile,
          role
        ),
      [
        adminProfile,
        role,
      ]
    );

  const [
    formData,
    setFormData,
  ] = useState({
    ...createEmptyEmployeeProfile(),
    password: "",
    reportingManager: "",
  });

  const [
    permissions,
    setPermissions,
  ] = useState(
    createPermissionObject(false)
  );

  const [
    initialReportingManager,
    setInitialReportingManager,
  ] = useState("");

  const [
    managers,
    setManagers,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          user,
          managerOptions,
        ] = await Promise.all([
          getManagedUser(role, id),
          getReportingManagers(id),
        ]);

        const managerId =
          user?.reportingManager?._id ||
          user?.reportingManager ||
          "";

        setInitialReportingManager(
          String(managerId)
        );

        setFormData({
          ...mapUserToEmployeeProfile(
            user
          ),
          password: "",
          reportingManager:
            String(managerId),
        });

        setPermissions(
          normalizePermissionObject(
            user?.permissions
          )
        );

        setManagers(managerOptions);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            `Unable to load ${config.singular.toLowerCase()}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [
    config.singular,
    id,
    role,
  ]);

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

  const handleProfilePictureUpload = async (croppedFile) => {
    try {
      const uploadData = new FormData();
      uploadData.append("profilePicture", croppedFile);
      
      setFormData((current) => ({
        ...current,
        profilePhoto: croppedFile 
      }));
    } catch (uploadError) {
      console.error("Upload failed", uploadError);
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,

        email:
          formData.email
            .trim()
            .toLowerCase(),

        permissions,
      };

      delete payload.employeeCode;

      if (!formData.password) {
        delete payload.password;
      }

      if (
        String(
          formData.reportingManager ||
          ""
        ) ===
        String(
          initialReportingManager ||
          ""
        )
      ) {
        delete payload.reportingManager;
      }

      await editManagedUser(
        role,
        id,
        payload
      );

      navigate(
        `${config.basePath}/${id}`,
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          `Unable to update ${config.singular.toLowerCase()}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-xs text-slate-500 sm:text-sm">
        Loading {config.singular.toLowerCase()}...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Edit {config.singular}
        </h1>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Update profile, account details and permissions.
        </p>
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
          onProfilePictureUpload={handleProfilePictureUpload}
        />

        <section className="grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Account Settings
            </h2>
          </div>

          <label>
            <span className="mb-1 block text-[10px] font-semibold text-slate-600 sm:text-xs">
              Reporting Manager
            </span>

            <select
              value={
                formData.reportingManager
              }
              onChange={(event) =>
                updateField(
                  "reportingManager",
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:text-sm"
            >
              <option value="">
                No reporting manager
              </option>

              {managers.map(
                (manager) => (
                  <option
                    key={manager._id}
                    value={manager._id}
                  >
                    {manager.label}
                  </option>
                )
              )}
            </select>

            {initialReportingManager &&
              !managers.some(
                (manager) =>
                  String(manager._id) ===
                  String(
                    initialReportingManager
                  )
              ) && (
                <p className="mt-1 text-[10px] text-amber-600 sm:text-xs">
                  Current reporting manager is unavailable. Select a new manager or update other details.
                </p>
              )}
          </label>

          <label>
            <span className="mb-1 block text-[10px] font-semibold text-slate-600 sm:text-xs">
              New Password
            </span>

            <input
              type="password"
              value={formData.password}
              onChange={(event) =>
                updateField(
                  "password",
                  event.target.value
                )
              }
              minLength={6}
              placeholder="Leave empty to keep current password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:text-sm"
            />
          </label>
        </section>

        <section className="border-t border-slate-200 pt-5">
          <PermissionTable
            permissions={permissions}
            allowedPermissions={
              allowedPermissions
            }
            onChange={
              setPermissions
            }
          />
        </section>

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                config.basePath
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {submitting
              ? "Saving..."
              : `Save ${config.singular}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditManagedUserPage;