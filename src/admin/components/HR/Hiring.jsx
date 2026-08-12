import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import { 
  fetchAdminJobs, 
  createAdminJob, 
  updateAdminJob, 
  toggleAdminJobStatus, 
  deleteAdminJob 
} from "../../api/jobApi";

const Hiring = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-Time",
    experience: "1",
    minSalary: "",
    maxSalary: "",
    internshipType: "Paid",
    duration: "",
    promotionAfterInternship: "Yes"
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-Time",
      experience: "1",
      minSalary: "",
      maxSalary: "",
      internshipType: "Paid",
      duration: "",
      promotionAfterInternship: "Yes"
    });
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditId(job._id);
    setFormData({
      title: job.title || "",
      department: job.department || "",
      location: job.location || "",
      type: job.type || "Full-Time",
      experience: job.experience || "1",
      minSalary: job.minSalary || "",
      maxSalary: job.maxSalary || "",
      internshipType: job.internshipType || "Paid",
      duration: job.duration || "",
      promotionAfterInternship: job.promotionAfterInternship || "Yes"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = { ...formData };
    
    if (payload.type !== "Internship") {
      payload.internshipType = "";
      payload.duration = "";
      payload.promotionAfterInternship = "";
    }
    
    if (payload.type === "Internship" && payload.internshipType === "Unpaid") {
      payload.minSalary = null;
      payload.maxSalary = null;
    }

    try {
      if (editId) {
        await updateAdminJob(editId, payload);
        toast.success("Job updated successfully");
      } else {
        await createAdminJob(payload);
        toast.success("Job posted successfully");
      }
      setShowModal(false);
      loadJobs();
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleAdminJobStatus(id);
      loadJobs();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

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

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Post New Job
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm font-medium text-slate-500">Loading jobs...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm font-medium text-slate-500">No job postings found.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{job.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-[11px] uppercase tracking-wider font-bold rounded-full ${job.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold flex justify-end items-center gap-4">
                      <button 
                        onClick={() => openEditModal(job)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button 
                        onClick={() => handleToggleStatus(job._id)}
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          job.isActive 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {job.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{editId ? "Edit Job Posting" : "Create New Job Posting"}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Senior React Developer"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Engineering"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Remote / Lucknow"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Employment Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Experience Required *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Year' : 'Years'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.type === "Internship" && (
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Internship Type *</label>
                    <select
                      name="internshipType"
                      value={formData.internshipType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Duration *</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 3 Months"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Promotion to Full-Time *</label>
                    <select
                      name="promotionAfterInternship"
                      value={formData.promotionAfterInternship}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              )}

              {(formData.type !== "Internship" || formData.internshipType === "Paid") && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Min Salary (INR) *</label>
                    <input
                      type="number"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 300000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Max Salary (INR) *</label>
                    <input
                      type="number"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 500000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[13px] font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : editId ? "Update Job" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hiring;