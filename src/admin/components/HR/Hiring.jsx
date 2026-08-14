import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Eye, Edit, Trash2, ArrowLeft } from "lucide-react"; // Import ArrowLeft
import { fetchAdminJobs, deleteAdminJob, toggleAdminJobStatus } from "../../api/jobApi";

const Hiring = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminJobs();
      setJobs(data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteAdminJob(id);
        toast.success("Job deleted successfully");
        loadJobs();
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleAdminJobStatus(id);
      toast.success("Status updated successfully");
      loadJobs();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "Active") return matchesSearch && job.isActive;
    if (statusFilter === "Inactive") return matchesSearch && !job.isActive;
    return matchesSearch;
  });

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Back button and title container */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Job Postings</h1>
        </div>
        <button
          onClick={() => navigate("/admin/hiring/add")}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Post New Job
        </button>
      </div>

      <div className="bg-white p-3 rounded-t-xl border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
                statusFilter === status 
                  ? "bg-teal-50 text-teal-700 border border-teal-200" 
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-b-xl border-x border-b border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Job Title</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Update Status</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-[13px] font-medium text-slate-500">Loading jobs...</td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-[13px] font-medium text-slate-500">No jobs found.</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-[13px] font-bold text-slate-900">{job.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[13px] font-medium text-slate-600">{job.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[13px] font-medium text-slate-600">{job.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full ${job.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleStatus(job._id)}
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          job.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {job.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-[13px] font-semibold flex justify-center items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/hiring/view/${job._id}`)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/hiring/edit/${job._id}`)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Job"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(job._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
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

export default Hiring;