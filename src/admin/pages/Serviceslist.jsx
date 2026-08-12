import { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import ServiceActionButtons from "../components/ServiceActionButtons";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  changeServiceStatus,
  fetchAdminServices,
  removeAdminService,
} from "../services/adminServiceApi";

const defaultPagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  firstRecord: 0,
  lastRecord: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const Serviceslist = () => {
  const { hasPermission } = useAdminAuth();

  const canView = hasPermission("services", "view");

  const canCreate = useMemo(
    () => hasPermission("services", "create"),
    [hasPermission],
  );

  const canEdit = hasPermission("services", "edit");

  const canDelete = hasPermission("services", "delete");

  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [mode, setMode] = useState("all");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState(defaultPagination);

  const [modes, setModes] = useState(["Clinic", "Video", "Home Sample"]);

  const [loading, setLoading] = useState(true);

  const [workingId, setWorkingId] = useState("");

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchAdminServices({
        search,
        status,
        mode,
        page,
      });

      setServices(result.services);

      setPagination(result.pagination);

      setModes(result.filters?.modes || ["Clinic", "Video", "Home Sample"]);

      if (result.pagination.currentPage !== page) {
        setPage(result.pagination.currentPage);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load services",
      );
    } finally {
      setLoading(false);
    }
  }, [mode, page, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(loadServices, 300);

    return () => window.clearTimeout(timer);
  }, [loadServices]);

  const handleStatusChange = async (service) => {
    const nextStatus = !service.isActive;

    const confirmed = window.confirm(
      `${nextStatus ? "Activate" : "Deactivate"} "${service.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setWorkingId(service._id);
    setError("");
    setNotice("");

    try {
      await changeServiceStatus(service._id, nextStatus);

      setNotice(
        nextStatus
          ? "Service activated successfully."
          : "Service deactivated successfully.",
      );

      await loadServices();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to change service status",
      );
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(`Delete "${service.title}" permanently?`);

    if (!confirmed) {
      return;
    }

    setWorkingId(service._id);
    setError("");
    setNotice("");

    try {
      await removeAdminService(service._id);

      setNotice("Service deleted successfully.");

      if (services.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadServices();
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to delete service",
      );
    } finally {
      setWorkingId("");
    }
  };

  const renderActions = (service) => {
    return (
      <ServiceActionButtons
        service={service}
        canView={canView}
        canEdit={canEdit}
        canDelete={canDelete}
        working={workingId === service._id}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
            Our Services
          </h1>

          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
            View and manage healthcare services.
          </p>
        </div>

        {canCreate && (
          <Link
            to="/admin/services/create"
            className="rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-700 sm:text-xs"
          >
            Add Service
          </Link>
        )}
      </div>

      <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-2 sm:grid-cols-3 sm:p-3">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search code, title or category"
          className="rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-blue-500 sm:text-xs"
        />

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-blue-500 sm:text-xs"
        >
          <option value="all">Active and inactive</option>

          <option value="active">Active</option>

          <option value="inactive">Inactive</option>
        </select>

        <select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-blue-500 sm:text-xs"
        >
          <option value="all">All modes</option>

          {modes.map((modeOption) => (
            <option key={modeOption} value={modeOption}>
              {modeOption}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-700 sm:text-xs">
          {error}
        </div>
      )}

      {notice && (
        <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] text-emerald-700 sm:text-xs">
          {notice}
        </div>
      )}

      <div className="space-y-2 md:hidden">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white py-8 text-center text-[10px] text-slate-500">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white py-8 text-center text-[10px] text-slate-500">
            No service found.
          </div>
        ) : (
          services.map((service) => (
            <article
              key={service._id}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-blue-600">
                    #{service.serviceCode}
                  </p>

                  <h2 className="truncate text-xs font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {service.category}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    {service.consultationMode.join(", ")}
                    {" · "}
                    {formatPrice(service.startingPrice)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                    service.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2">
                {renderActions(service)}
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[900px] divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Code",
                "Title",
                "Category",
                "Mode",
                "Price",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ${
                    heading === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-3 py-8 text-center text-xs text-slate-500"
                >
                  Loading services...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-3 py-8 text-center text-xs text-slate-500"
                >
                  No service found.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2 text-[11px] font-semibold text-blue-700">
                    {service.serviceCode}
                  </td>

                  <td className="max-w-56 truncate px-3 py-2 text-xs font-semibold text-slate-900">
                    {service.title}
                  </td>

                  <td className="px-3 py-2 text-xs text-slate-600">
                    {service.category}
                  </td>

                  <td className="px-3 py-2 text-[11px] text-slate-600">
                    {service.consultationMode.join(", ")}
                  </td>

                  <td className="whitespace-nowrap px-3 py-2 text-xs font-semibold text-slate-700">
                    {formatPrice(service.startingPrice)}
                  </td>

                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        service.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex justify-end">
                      {renderActions(service)}
                    </div>
                  </td>
                </tr>
              ))
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
            disabled={!pagination.hasPreviousPage || loading}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 disabled:opacity-40 sm:text-xs"
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
            disabled={!pagination.hasNextPage || loading}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 disabled:opacity-40 sm:text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Serviceslist;
