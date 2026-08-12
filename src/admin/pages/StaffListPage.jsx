import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  deleteStaffUser,
  getStaffUsers,
  updateStaffStatus,
} from "../services/adminStaffService";

import {
  canManageStaffAction,
} from "../utils/staffPermissions";

const StaffListPage = () => {
  const {
    adminProfile,
    hasPermission,
  } = useAdminAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const canCreateStaff = useMemo(() => {
    if (adminProfile?.role === "superadmin") {
      return true;
    }

    return hasPermission("employees.create");
  }, [adminProfile, hasPermission]);

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      setError("");

      try {
        const staffUsers = await getStaffUsers({
          search,
          status,
          role,
        });

        setUsers(staffUsers);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load staff users"
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadStaff, 250);

    return () => clearTimeout(timer);
  }, [search, status, role]);

  const can = (staffUser, action) => {
    return canManageStaffAction(
      adminProfile,
      hasPermission,
      staffUser.role,
      action
    );
  };

  const handleStatus = async (staffUser) => {
    setWorkingId(staffUser._id);
    setError("");

    try {
      const updatedUser = await updateStaffStatus(
        staffUser._id,
        !staffUser.isActive
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === updatedUser._id
            ? updatedUser
            : item
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update status"
      );
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (staffUser) => {
    const shouldDelete = window.confirm(
      `Delete ${staffUser.fullName}? This action cannot be undone.`
    );

    if (!shouldDelete) {
      return;
    }

    setWorkingId(staffUser._id);
    setError("");

    try {
      await deleteStaffUser(staffUser._id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item._id !== staffUser._id
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete staff user"
      );
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Staff users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View, edit, update, delete and manage permissions.
          </p>
        </div>

        {canCreateStaff && (
          <Link
            to="/admin/staff/add"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add staff
          </Link>
        )}
      </div>

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search name or email"
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {adminProfile?.role === "superadmin" && (
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          >
            <option value="all">All roles</option>
            <option value="admin">Admins</option>
            <option value="employee">
              Employees
            </option>
          </select>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Loading staff...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No staff user found.
                </td>
              </tr>
            ) : (
              users.map((staffUser) => (
                <tr key={staffUser._id}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {staffUser.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {staffUser.email}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-sm capitalize text-slate-700">
                    {staffUser.role}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        staffUser.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {staffUser.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      {can(staffUser, "view") && (
                        <Link
                          to={`/admin/staff/${staffUser._id}`}
                          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                        >
                          View
                        </Link>
                      )}

                      {can(staffUser, "edit") && (
                        <Link
                          to={`/admin/staff/${staffUser._id}/edit`}
                          className="rounded-md border border-blue-200 px-2.5 py-1.5 text-xs font-semibold text-blue-700"
                        >
                          Edit
                        </Link>
                      )}

                      {can(
                        staffUser,
                        "permissions"
                      ) && (
                        <Link
                          to={`/admin/staff/${staffUser._id}/permissions`}
                          className="rounded-md border border-violet-200 px-2.5 py-1.5 text-xs font-semibold text-violet-700"
                        >
                          Permissions
                        </Link>
                      )}

                      {can(staffUser, "status") && (
                        <button
                          type="button"
                          disabled={
                            workingId === staffUser._id
                          }
                          onClick={() =>
                            handleStatus(staffUser)
                          }
                          className="rounded-md border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 disabled:opacity-50"
                        >
                          {staffUser.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}

                      {can(staffUser, "delete") && (
                        <button
                          type="button"
                          disabled={
                            workingId === staffUser._id
                          }
                          onClick={() =>
                            handleDelete(staffUser)
                          }
                          className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffListPage;
