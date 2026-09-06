import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { fetchAdminJobById, createAdminJob, updateAdminJob } from "../../api/jobApi";

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-Time",
    experience: "0",
    vacancies: "1",
    compensationType: "Salary",
    minSalary: "",
    maxSalary: "",
    commissionPercentage: "",
    stipend: "",
    internshipType: "Paid",
    duration: "",
    promotionAfterInternship: "Yes",
    isActive: true
  });

  useEffect(() => {
    if (id) {
      loadJobDetails();
    }
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminJobById(id);
      setFormData({
        title: data.title || "",
        department: data.department || "",
        location: data.location || "",
        type: data.type || "Full-Time",
        experience: data.experience !== undefined ? String(data.experience) : "0",
        vacancies: data.vacancies || "1",
        compensationType: data.compensationType || "Salary",
        minSalary: data.minSalary || "",
        maxSalary: data.maxSalary || "",
        commissionPercentage: data.commissionPercentage || "",
        stipend: data.stipend || "",
        internshipType: data.internshipType || "Paid",
        duration: data.duration || "",
        promotionAfterInternship: data.promotionAfterInternship || "Yes",
        isActive: data.isActive !== undefined ? data.isActive : true
      });
    } catch (error) {
      toast.error("Failed to load job details");
      navigate("/hiring");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData };

    if (payload.type !== "Internship") {
      payload.internshipType = "";
      payload.duration = "";
      payload.promotionAfterInternship = "";
      payload.stipend = null;

      if (payload.compensationType === "Salary") {
        payload.commissionPercentage = "";
      } else if (payload.compensationType === "Commission") {
        payload.minSalary = null;
        payload.maxSalary = null;
      }
    }

    if (payload.type === "Internship") {
      payload.compensationType = "Salary";
      payload.minSalary = null;
      payload.maxSalary = null;
      payload.commissionPercentage = "";
      if (payload.internshipType === "Unpaid") {
        payload.stipend = null;
      }
    }

    try {
      if (id) {
        await updateAdminJob(id, payload);
        toast.success("Job updated successfully");
      } else {
        await createAdminJob(payload);
        toast.success("Job posted successfully");
      }
      navigate("/admin/hr/hiring");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading form...</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{id ? "Edit Job Posting" : "Create New Job Posting"}</h2>

        <form onSubmit={handleSubmit} className="grid gap-6">
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

          <div className="grid gap-6 sm:grid-cols-2">
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

          <div className="grid gap-6 sm:grid-cols-3">
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
                <option value="0">Fresher (0 Years)</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Year' : 'Years'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Number of Vacancies *</label>
              <input
                type="number"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="e.g. 2"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
              />
            </div>
          </div>

          {formData.type === "Internship" && (
            <div className="grid gap-6 sm:grid-cols-3">
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

          {formData.type === "Internship" && formData.internshipType === "Paid" && (
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Stipend Amount (INR / Month) *</label>
              <input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleInputChange}
                required
                placeholder="e.g. 15000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
              />
            </div>
          )}

          {formData.type !== "Internship" && (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Compensation Type *</label>
                <select
                  name="compensationType"
                  value={formData.compensationType}
                  onChange={handleInputChange}
                  required
                  className="w-full md:w-1/3 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                >
                  <option value="Salary">Fixed Salary</option>
                  <option value="Commission">Commission Based</option>
                </select>
              </div>

              {formData.compensationType === "Salary" ? (
                <div className="grid gap-6 sm:grid-cols-2">
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
              ) : (
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Project Commission (%) *</label>
                  <input
                    type="text"
                    name="commissionPercentage"
                    value={formData.commissionPercentage}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 20-25"
                    className="w-full md:w-1/3 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
              )}
            </>
          )}

          {id && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="isActive" className="text-[13px] font-semibold text-slate-700">
                Job is Active (visible to public)
              </label>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-slate-300 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-[13px] font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : id ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;