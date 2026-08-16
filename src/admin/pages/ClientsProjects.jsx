import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { fetchClientProjects, deleteClientProject } from "../api/clientProjectApi";

const ClientProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadProjects = async () => {
    try {
      setLoading(true);
      let data = await fetchClientProjects();
      
      if (statusFilter !== "All") {
        data = data.filter(p => p.status === statusFilter);
      }
      if (searchInput) {
        const lower = searchInput.toLowerCase();
        data = data.filter(p => p.projectId.toLowerCase().includes(lower) || p.title.toLowerCase().includes(lower));
      }

      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadProjects();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteClientProject(id);
        toast.success("Project deleted successfully");
        loadProjects();
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Planning": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-amber-100 text-amber-700";
      case "Completed": return "bg-emerald-100 text-emerald-700";
      case "On Hold": return "bg-orange-100 text-orange-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold text-slate-900">Client Projects</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex w-full sm:w-auto relative">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input 
            type="text" 
            placeholder="Search ID, Title..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-slate-300 bg-white rounded-lg pl-8 pr-3 py-1.5 w-full sm:w-72 text-[12px] focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all"
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-[12px] font-medium text-slate-700 flex items-center gap-1"><Filter size={14}/> Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all cursor-pointer"
          >
            <option value="All">All Projects</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project ID & Title</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Employee</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-[12px] font-medium text-slate-500">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-[12px] font-medium text-slate-500">No projects found.</td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="text-[12px] font-bold text-slate-900">{proj.projectId}</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">{proj.title}</div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="text-[12px] font-bold text-slate-900">{proj.clientName}</div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="text-[12px] font-bold text-slate-900">{proj.assignedEmployee?.fullName || "Unassigned"}</div>
                      {proj.assignedEmployee && (
                         <div className="text-[10px] font-medium text-slate-500 mt-0.5">Emp ID: {proj.assignedEmployee.employeeCode}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 min-w-[50px]">
                          <div className="bg-teal-600 h-1.5 rounded-full transition-all" style={{ width: `${proj.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-md ${getStatusColor(proj.status)}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-right text-[12px] font-semibold flex justify-end items-center gap-1.5">
                      <button 
                        onClick={() => navigate(`/admin/clientprojects/${proj._id}`)}
                        className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                        title="View Progress"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/clientprojects/edit/${proj._id}`)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Project"
                      >
                        <Edit size={14} />
                      </button>

                      <button 
                        onClick={() => handleDelete(proj._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
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

export default ClientProjects;