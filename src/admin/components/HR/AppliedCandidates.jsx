import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Search, Filter, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchApplications, updateApplicationStatus, fetchUniqueAppliedRoles } from "../../api/applicationApi";

const AppliedCandidates = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("job");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [appliedRole, setAppliedRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("All");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await fetchUniqueAppliedRoles();
        if (roles) {
          setAvailableRoles(roles);
        }
      } catch (error) {
        console.error("Failed to fetch available roles");
      }
    };
    loadRoles();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        viewMode,
        search: searchTerm,
        status: selectedStatus,
        appliedRole,
        experienceLevel
      };

      const data = await fetchApplications(params);

      if (data && data.data) {
        setApplications(data.data);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setApplications(data || []);
        setTotalCount(data?.length || 0);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [page, viewMode, selectedStatus, experienceLevel, appliedRole]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        loadApplications();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
    setSelectedStatus("All");
    setAppliedRole("");
    setExperienceLevel("All");
    setPage(1);
  }, [viewMode]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      toast.success("Status updated successfully");
      loadApplications();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700";
      case "Reviewed": return "bg-blue-100 text-blue-700";
      case "Shortlisted": return "bg-emerald-100 text-emerald-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="w-full flex flex-col p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Applied Candidates</h1>
          <span className="bg-teal-100 text-teal-700 py-1 px-3 rounded-full text-xs font-bold">
            Total: {totalCount}
          </span>
        </div>

        <div className="flex bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("job")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "job" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Vacancy Applications
          </button>
          <button
            onClick={() => setViewMode("direct")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "direct" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Direct Applications
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by ID, Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all"
          />
        </div>

        {viewMode === "job" && (
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={appliedRole}
              onChange={(e) => setAppliedRole(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              {availableRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}

        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>

        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">App ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Applied Role</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-xs font-medium text-slate-500">Loading candidates...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-xs font-medium text-slate-500">
                    No {viewMode === "job" ? "vacancy" : "direct"} applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-teal-600">
                      {app.applicationId || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-900">
                      {app.fullName || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-slate-600">
                      {app.appliedRole || "N/A"}
                      {app.jobId && <span className="block text-[10px] text-teal-600 mt-0.5">{app.jobId.department}</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-slate-600">
                      {app.experienceLevel || "Fresher"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-slate-600">
                      {app.phone || "N/A"}
                      <span className="block text-[10px] text-slate-400 mt-0.5">{app.email || "N/A"}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={app.status || "Pending"}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-all ${getStatusColor(app.status || "Pending")}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-semibold">
                      <button
                        onClick={() => navigate(`/admin/hr/applicants/${app._id}`)}
                        className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-600 hover:text-teal-800 hover:bg-teal-100 transition-colors px-3 py-1.5 rounded-xl"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedCandidates;