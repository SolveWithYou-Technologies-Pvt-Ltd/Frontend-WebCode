import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  getStaffUser,
} from "../services/adminStaffService";

import {
  canManageStaffAction,
} from "../utils/staffPermissions";

import {
  groupPermissions,
  permissionLabel,
} from "../utils/permissionDisplay";

const ViewStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    adminProfile,
    hasPermission,
  } = useAdminAuth();

  const [staffUser, setStaffUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getStaffUser(id);
        setStaffUser(user);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load staff user"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading staff user...
      </p>
    );
  }

  if (!staffUser) {
    return (
      <div>
        <p className="text-sm text-red-600">
          {error || "Staff user was not found"}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/staff")
          }
          className="mt-3 text-sm font-semibold text-blue-600"
        >
          Back to staff
        </button>
      </div>
    );
  }

  const permissionGroups = groupPermissions(
    staffUser.permissions
  );

  const canEdit = canManageStaffAction(
    adminProfile,
    hasPermission,
    staffUser.role,
    "edit"
  );

  const canManagePermissions =
    canManageStaffAction(
      adminProfile,
      hasPermission,
      staffUser.role,
      "permissions"
    );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {staffUser.fullName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {staffUser.email}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <Link
              to={`/admin/staff/${staffUser._id}/edit`}
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700"
            >
              Edit
            </Link>
          )}

          {canManagePermissions && (
            <Link
              to={`/admin/staff/${staffUser._id}/permissions`}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Permissions
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">
            Role
          </p>
          <p className="mt-2 font-semibold capitalize text-slate-900">
            {staffUser.role}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">
            Status
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {staffUser.isActive
              ? "Active"
              : "Inactive"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">
            Created
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {new Date(
              staffUser.createdAt
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">
          Assigned permissions
        </h2>

        {permissionGroups.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No permission is assigned.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {permissionGroups.map((group) => (
              <div key={group.moduleName}>
                <p className="text-sm font-semibold text-slate-900">
                  {group.title}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item.permission}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {permissionLabel(
                        item.permission
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStaffPage;
