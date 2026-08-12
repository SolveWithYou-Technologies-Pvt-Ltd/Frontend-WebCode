import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PermissionTable from "./PermissionTable";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  createPermissionObject,
  getAssignablePermissionMask,
  normalizePermissionObject,
} from "../config/permissionTable";

import {
  getManagedUser,
  saveManagedUserPermissions,
} from "../services/adminUserService";

import {
  getRoleConfig,
} from "../utils/userManagement";

const EditManagedPermissionsPage = ({
  role,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { adminProfile } =
    useAdminAuth();

  const config = getRoleConfig(role);

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

  const [user, setUser] =
    useState(null);

  const [
    permissions,
    setPermissions,
  ] = useState(
    createPermissionObject(false)
  );

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError("");

      try {
        const managedUser =
          await getManagedUser(
            role,
            id
          );

        setUser(managedUser);

        setPermissions(
          normalizePermissionObject(
            managedUser?.permissions
          )
        );
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            `Unable to load ${config.singular.toLowerCase()} permissions`
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [
    config.singular,
    id,
    role,
  ]);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await saveManagedUserPermissions(
        role,
        id,
        permissions
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
          "Unable to save permissions"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Loading permissions...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          {error ||
            `${config.singular} was not found`}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(config.basePath)
          }
          className="mt-3 text-sm font-semibold text-blue-600"
        >
          Back to {config.plural}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Edit {config.singular} Permissions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {user.fullName} · {user.email}
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

        <PermissionTable
          permissions={permissions}
          allowedPermissions={
            allowedPermissions
          }
          onChange={setPermissions}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(config.basePath)
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : "Save Permissions"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditManagedPermissionsPage;
