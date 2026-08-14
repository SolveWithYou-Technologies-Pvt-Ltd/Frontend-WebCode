import { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import AdminAvatar from "./AdminAvatar";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  changeManagedUserStatus,
  getManagedUsers,
} from "../services/adminUserService";

import { getRoleConfig } from "../utils/userManagement";

const defaultPagination = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalRecords: 0,
  firstRecord: 0,
  lastRecord: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

const getStatusDetails = (user) => {
  if (user.isDeleted) {
    return {
      label: "Deleted",
      className: "bg-slate-100 text-slate-600",
    };
  }

  if (user.isActive) {
    return {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "Inactive",
    className: "bg-red-50 text-red-700",
  };
};

const ManagedUsersPage = ({ role }) => {
  const config = getRoleConfig(role);

  const { hasPermission } = useAdminAuth();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState(defaultPagination);

  const [loading, setLoading] = useState(true);

  const [workingId, setWorkingId] = useState("");

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  const canCreate = useMemo(
    () => hasPermission(config.permissionPrefix, "create"),
    [config.permissionPrefix, hasPermission],
  );

  const canEdit = hasPermission(config.permissionPrefix, "edit");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getManagedUsers(role, {
        search,
        status,
        page,
      });

      setUsers(result.users);
      setPagination(result.pagination);

      if (result.pagination.currentPage !== page) {
        setPage(result.pagination.currentPage);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          `Unable to load ${config.plural.toLowerCase()}`,
      );
    } finally {
      setLoading(false);
    }
  }, [config.plural, page, role, search, status]);

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300);

    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const showReassignmentNotice = (reassignment, actionText) => {
    if (!reassignment?.movedCount) {
      setNotice(actionText);
      return;
    }

    const managerName = reassignment.newManager?.label || "the top-level team";

    setNotice(
      `${actionText} ${reassignment.movedCount} direct report(s) moved under ${managerName}.`,
    );
  };

  const handleStatus = async (user) => {
    setWorkingId(user._id);
    setError("");
    setNotice("");

    try {
      const result = await changeManagedUserStatus(
        role,
        user._id,
        !user.isActive,
      );

      showReassignmentNotice(
        result.reassignment,
        result.user.isActive ? "Account activated." : "Account deactivated.",
      );

      await loadUsers();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update account status",
      );
    } finally {
      setWorkingId("");
    }
  };

  const renderActions = (user) => {
    const isDeleted = user.isDeleted === true;

    return (
      <div className="flex flex-wrap items-center gap-1">
        <Link
          to={`${config.basePath}/${user._id}`}
          className="rounded border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 sm:text-xs"
        >
          View
        </Link>

        {!isDeleted && canEdit && (
          <>
            <Link
              to={`${config.basePath}/${user._id}/edit`}
              className="rounded border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 sm:text-xs"
            >
              Edit
            </Link>

            <button
              type="button"
              disabled={workingId === user._id}
              onClick={() => handleStatus(user)}
              className="rounded border border-amber-200 px-2 py-1 text-[10px] font-semibold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
          </>
        )}
      </div>
    );
  };

  const previousPage = () => {
    if (pagination.hasPreviousPage && !loading) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const nextPage = () => {
    if (pagination.hasNextPage && !loading) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
            {config.plural}
          </h1>

          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
            View and manage account information.
          </p>
        </div>

        {canCreate && (
          <Link
            to={`${config.basePath}/add`}
            className="rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-700 sm:text-xs"
          >
            Add {config.singular}
          </Link>
        )}
      </div>

      <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-2 sm:grid-cols-2 sm:p-3">
        <input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search employee ID, name or email"
          className="rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-blue-500 sm:text-xs"
        />

        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-blue-500 sm:text-xs"
        >
          <option value="all">Active and inactive</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-[10px] text-red-700 sm:text-xs">
          {error}
        </div>
      )}

      {notice && (
        <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10px] text-emerald-700 sm:text-xs">
          {notice}
        </div>
      )}

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-8 text-center text-[11px] text-slate-500">
            Loading {config.plural.toLowerCase()}...
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-8 text-center text-[11px] text-slate-500">
            No {config.singular.toLowerCase()} found.
          </div>
        ) : (
          users.map((user) => {
            const statusDetails = getStatusDetails(user);

            return (
              <article
                key={user._id}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <AdminAvatar
                      user={user}
                      sizeClass="h-9 w-9"
                      textClass="text-[10px]"
                    />

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-blue-600">
                        {user.employeeCode || "No employee ID"}
                      </p>

                      <h2 className="mt-0.5 truncate text-xs font-bold text-slate-900">
                        {user.fullName}
                      </h2>

                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusDetails.className}`}
                  >
                    {statusDetails.label}
                  </span>
                </div>

                <div className="mt-2 border-t border-slate-100 pt-2">
                  {renderActions(user)}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Tablet and desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[760px] divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {["Employee ID", "Name", "Email", "Status", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ${
                      heading === "Actions" ? "text-right" : "text-left"
                    }`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-3 py-8 text-center text-xs text-slate-500"
                >
                  Loading {config.plural.toLowerCase()}...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-3 py-8 text-center text-xs text-slate-500"
                >
                  No {config.singular.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const statusDetails = getStatusDetails(user);

                return (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-blue-700">
                      {user.employeeCode || "—"}
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <AdminAvatar
                          user={user}
                          sizeClass="h-7 w-7"
                          textClass="text-[9px]"
                        />

                        <span className="text-xs font-semibold text-slate-900">
                          {user.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-64 truncate px-3 py-2 text-xs text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusDetails.className}`}
                      >
                        {statusDetails.label}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex justify-end">
                        {renderActions(user)}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-slate-500 sm:text-xs">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {pagination.firstRecord}
          </span>
          {" - "}
          <span className="font-semibold text-slate-700">
            {pagination.lastRecord}
          </span>
          {" of "}
          <span className="font-semibold text-slate-700">
            {pagination.totalRecords}
          </span>
        </p>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button
            type="button"
            onClick={previousPage}
            disabled={!pagination.hasPreviousPage || loading}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs"
          >
            Previous
          </button>

          <span className="min-w-20 text-center text-[10px] font-medium text-slate-600 sm:text-xs">
            Page {pagination.currentPage}
            {" of "}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={nextPage}
            disabled={!pagination.hasNextPage || loading}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagedUsersPage;
