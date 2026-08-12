import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import AdminAvatar from "./AdminAvatar";
import AuditDetails from "./AuditDetails";
import PermissionTable from "./PermissionTable";
import ProfileDetailsSections from "./ProfileDetailsSections";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  changeManagedUserRole,
  getManagedUser,
} from "../services/adminUserService";

import {
  getRoleConfig,
} from "../utils/userManagement";

const roleLabels = {
  admin: "Admin",
  employee: "Employee",
};

const ViewManagedUserPage = ({
  role,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const config =
    getRoleConfig(role);

  const {
    adminProfile,
    hasPermission,
  } = useAdminAuth();

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedRole,
    setSelectedRole,
  ] = useState(role);

  const [
    changingRole,
    setChangingRole,
  ] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError("");

      try {
        const result =
          await getManagedUser(
            role,
            id
          );

        setUser(result);

        setSelectedRole(
          result?.role || role
        );
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

    loadUser();
  }, [
    config.singular,
    id,
    role,
  ]);

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading {config.singular.toLowerCase()}...
      </p>
    );
  }

  if (!user) {
    return (
      <div>
        <p className="text-sm text-red-600">
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

  const canEdit =
    !user.isDeleted &&
    hasPermission(
      config.permissionPrefix,
      "edit"
    );

  /*
    The role selector is visible only while a
    Superadmin is viewing an Admin/Employee profile.
  */
  const canChangeRole =
    adminProfile?.role ===
      "superadmin" &&
    !user.isDeleted &&
    [
      "admin",
      "employee",
    ].includes(user.role);

  const handleRoleChange = async () => {
    if (
      selectedRole === user.role
    ) {
      setError(
        "Please select a different role"
      );
      return;
    }

    const currentRoleLabel =
      roleLabels[user.role];

    const newRoleLabel =
      roleLabels[selectedRole];

    const confirmed =
      window.confirm(
        `Change ${user.fullName}'s role from ${currentRoleLabel} to ${newRoleLabel}?`
      );

    if (!confirmed) {
      return;
    }

    setChangingRole(true);
    setError("");

    try {
      const result =
        await changeManagedUserRole(
          user.role,
          user._id,
          selectedRole
        );

      const updatedUserId =
        result?.user?._id ||
        user._id;

      const nextBasePath =
        selectedRole === "admin"
          ? "/admin/admins"
          : "/admin/employees";

      navigate(
        `${nextBasePath}/${updatedUserId}`,
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          "Unable to change user role"
      );
    } finally {
      setChangingRole(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AdminAvatar
            user={user}
            sizeClass="h-14 w-14 sm:h-16 sm:w-16"
            textClass="text-base sm:text-lg"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {user.fullName}
              </h1>

              {user.isDeleted && (
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">
                  Deleted
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Complete {config.singular.toLowerCase()} profile
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-2">
            <Link
              to={`${config.basePath}/${user._id}/edit`}
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700"
            >
              Edit Profile
            </Link>

          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <ProfileDetailsSections
        user={user}
      />

      {canChangeRole && (
        <section className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Change Role
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Superadmin can change this account between Admin and Employee.
              </p>

              <p className="mt-1 text-xs text-amber-700">
                Employee ID remains unchanged. Existing valid permissions are preserved.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-64">
              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(
                    event.target.value
                  )
                }
                className="rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500"
              >
                <option value="admin">
                  Admin
                </option>

                <option value="employee">
                  Employee
                </option>
              </select>

              <button
                type="button"
                onClick={
                  handleRoleChange
                }
                disabled={
                  changingRole ||
                  selectedRole ===
                    user.role
                }
                className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingRole
                  ? "Changing Role..."
                  : "Change Role"}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="mt-5">
        <AuditDetails
          user={user}
          currentUserId={
            adminProfile?._id
          }
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Assigned Permissions
        </h2>

        <PermissionTable
          permissions={
            user.permissions
          }
          readOnly
          showOnlyGranted
        />
      </div>
    </div>
  );
};

export default ViewManagedUserPage;
