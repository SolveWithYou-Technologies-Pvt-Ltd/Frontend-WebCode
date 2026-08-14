import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Search, Filter, ArrowLeft } from "lucide-react"; // Import ArrowLeft
import { fetchApplications, updateApplicationStatus } from "../../api/applicationApi";

const AppliedCandidates = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("job"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await fetchApplications();
      setApplications(data);
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    setSearchTerm("");
    setSelectedStatus("All");
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

  const modeFilteredApps = applications.filter((app) => 
    viewMode === "job" ? !app.isGeneral : app.isGeneral
  );

  const finalFilteredApplications = modeFilteredApps.filter((app) => {
    const matchesSearch = searchTerm === "" || 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const currentStatus = app.status || "Pending";
    const matchesStatus = selectedStatus === "All" || currentStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Back button and title container */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Applied Candidates</h1>
        </div>
        
        <div className="flex bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("job")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "job" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Vacancy Applications
          </button>
          <button
            onClick={() => setViewMode("direct")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "direct" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Direct Applications
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by ID, Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all"
          />
        </div>
        <div className="relative sm:w-64">
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
              ) : finalFilteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-xs font-medium text-slate-500">
                    No {viewMode === "job" ? "vacancy" : "direct"} applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                finalFilteredApplications.map((app) => (
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
    </div>
  );
};

export default AppliedCandidates;