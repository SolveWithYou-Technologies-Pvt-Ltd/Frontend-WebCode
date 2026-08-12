import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import PermissionTable from "./PermissionTable";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  createPermissionObject,
  getAssignablePermissionMask,
} from "../config/permissionTable";

import {
  createManagedUser,
  getReportingManagers,
} from "../services/adminUserService";

import {
  getRoleConfig,
} from "../utils/userManagement";

const PasswordEyeIcon = ({
  passwordVisible,
}) => {
  if (passwordVisible) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.7a2 2 0 002.7 2.7" />
        <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5.3 9 5.3a14.5 14.5 0 01-3 3.7" />
        <path d="M6.2 6.3C4.2 7.6 3 9.3 3 9.3S6.5 14.6 12 14.6c1 0 2-.2 2.8-.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 12s3.5-5.3 9-5.3S21 12 21 12s-3.5 5.3-9 5.3S3 12 3 12z" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
};

const CreateManagedUserPage = ({
  role,
}) => {
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
    fullName: "",
    email: "",
    phone: "",
    password: "",
    reportingManager: "",
    permissions:
      createPermissionObject(false),
  });

  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false);

  const [
    managers,
    setManagers,
  ] = useState([]);

  const [
    loadingManagers,
    setLoadingManagers,
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
    const loadManagers = async () => {
      try {
        const result =
          await getReportingManagers();

        setManagers(result);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load reporting managers"
        );
      } finally {
        setLoadingManagers(false);
      }
    };

    loadManagers();
  }, []);

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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await createManagedUser(
        role,
        {
          ...formData,

          fullName:
            formData.fullName.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          phone:
            formData.phone.trim(),
        }
      );

      navigate(
        config.basePath,
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          `Unable to add ${config.singular.toLowerCase()}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Add {config.singular}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create the account and assign permissions. Remaining profile details can be completed after login.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-5"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h2 className="text-base font-bold text-slate-900">
              Account Information
            </h2>
          </div>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Full Name *
            </span>

            <input
              type="text"
              value={
                formData.fullName
              }
              onChange={(event) =>
                updateField(
                  "fullName",
                  event.target.value
                )
              }
              required
              minLength={2}
              autoComplete="name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Email Address *
            </span>

            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Phone Number *
            </span>

            <input
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              required
              autoComplete="tel"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Password *
            </span>

            <div className="relative">
              <input
                type={
                  passwordVisible
                    ? "text"
                    : "password"
                }
                value={
                  formData.password
                }
                onChange={(event) =>
                  updateField(
                    "password",
                    event.target.value
                  )
                }
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() =>
                  setPasswordVisible(
                    (currentValue) =>
                      !currentValue
                  )
                }
                aria-label={
                  passwordVisible
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  passwordVisible
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <PasswordEyeIcon
                  passwordVisible={
                    passwordVisible
                  }
                />
              </button>
            </div>
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Reporting Manager *
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
              required
              disabled={
                loadingManagers
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
            >
              <option value="">
                {loadingManagers
                  ? "Loading managers..."
                  : "Select reporting manager"}
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
          </label>

          
        </section>

        <section className="border-t border-slate-200 pt-6">
          <PermissionTable
            permissions={
              formData.permissions
            }
            allowedPermissions={
              allowedPermissions
            }
            onChange={(permissions) =>
              updateField(
                "permissions",
                permissions
              )
            }
          />
        </section>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() =>
              navigate(
                config.basePath
              )
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              loadingManagers ||
              !formData.reportingManager
            }
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Creating..."
              : `Add ${config.singular}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateManagedUserPage;
