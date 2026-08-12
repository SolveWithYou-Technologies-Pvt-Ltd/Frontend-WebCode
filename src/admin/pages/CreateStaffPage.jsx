import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import PermissionSelector from "../components/PermissionSelector";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  createStaffUser,
  getCreatePermissionOptions,
} from "../services/adminStaffService";

const CreateStaffPage = () => {
  const navigate = useNavigate();

  const {
    adminProfile,
    hasPermission,
  } = useAdminAuth();

  const roleOptions = useMemo(() => {
    if (adminProfile?.role === "superadmin") {
      return ["admin", "employee"];
    }

    return hasPermission("employees.create")
      ? ["employee"]
      : [];
  }, [adminProfile, hasPermission]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: roleOptions[0] || "employee",
    permissions: [],
    isActive: true,
  });

  const [permissionOptions, setPermissionOptions] =
    useState([]);

  const [
    loadingPermissions,
    setLoadingPermissions,
  ] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (
      roleOptions.length > 0 &&
      !roleOptions.includes(formData.role)
    ) {
      setFormData((currentData) => ({
        ...currentData,
        role: roleOptions[0],
      }));
    }
  }, [roleOptions, formData.role]);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!formData.role) {
        return;
      }

      setLoadingPermissions(true);
      setError("");

      try {
        const options =
          await getCreatePermissionOptions(
            formData.role
          );

        setPermissionOptions(options);

        setFormData((currentData) => ({
          ...currentData,
          permissions:
            currentData.permissions.filter(
              (permission) =>
                options.includes(permission)
            ),
        }));
      } catch (requestError) {
        setPermissionOptions([]);
        setError(
          requestError.response?.data?.message ||
            "Unable to load permission options"
        );
      } finally {
        setLoadingPermissions(false);
      }
    };

    loadPermissions();
  }, [formData.role]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await createStaffUser({
        ...formData,
        email: formData.email
          .trim()
          .toLowerCase(),
      });

      navigate("/admin/staff", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create staff user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Add staff
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Assign only the permissions required for the account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            minLength={6}
            required
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm capitalize"
          >
            {roleOptions.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}
          </select>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />

          <span className="text-sm font-medium text-slate-800">
            Active account
          </span>
        </label>

        <div className="mt-6">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Permissions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Edit opens an edit screen. Update allows saving changes.
            </p>
          </div>

          {loadingPermissions ? (
            <p className="text-sm text-slate-500">
              Loading permissions...
            </p>
          ) : (
            <PermissionSelector
              options={permissionOptions}
              selected={formData.permissions}
              onChange={(permissions) =>
                setFormData((currentData) => ({
                  ...currentData,
                  permissions,
                }))
              }
            />
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/staff")
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              loadingPermissions ||
              roleOptions.length === 0
            }
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting
              ? "Creating..."
              : "Create staff"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaffPage;
