import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { fetchClientProjectById, updateClientProject, fetchEmployeesForAssignment } from "../../api/clientProjectApi";

const ClientProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    assignedEmployee: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    progress: 0,
    description: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const projData = await fetchClientProjectById(id);
        const empData = await fetchEmployeesForAssignment();
        setEmployees(empData);
        
        setFormData({
          title: projData.title || "",
          clientName: projData.clientName || "",
          assignedEmployee: projData.assignedEmployee?._id || projData.assignedEmployee || "",
          startDate: projData.startDate ? new Date(projData.startDate).toISOString().split('T')[0] : "",
          endDate: projData.endDate ? new Date(projData.endDate).toISOString().split('T')[0] : "",
          status: projData.status || "Planning",
          progress: projData.progress || 0,
          description: projData.description || ""
        });
      } catch (error) {
        toast.error("Failed to load project details");
        navigate("/admin/clientprojects");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateClientProject(id, formData);
      toast.success("Project updated successfully");
      navigate("/admin/clientprojects");
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10 text-[13px] text-slate-500">Loading form...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/clientprojects")}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Edit Project</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Project Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Client Name *</label>
              <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Assign Employee *</label>
              <select value={formData.assignedEmployee} onChange={(e) => setFormData({...formData, assignedEmployee: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName} ({emp.employeeCode || 'No ID'}) - Dept: {emp.department || 'N/A'} - Desig: {emp.designation || 'N/A'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Start Date *</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">End Date *</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Status *</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Progress (%) *</label>
              <input type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Project Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none"></textarea>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/admin/clientprojects")} className="px-4 py-2 border border-slate-300 rounded-lg text-[13px] font-bold text-slate-600">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 disabled:opacity-70"><Save size={14}/> Update Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientProjectEdit;