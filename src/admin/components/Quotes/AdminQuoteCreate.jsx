import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Info } from "lucide-react";
import useAdminAuth from "../../hooks/useAdminAuth";
import { createAdminQuote } from "../../api/quoteApi";

const facilitiesOptions = [
  "Deployment & Cloud Hosting",
  "Email Notifications",
  "WhatsApp Alerts API",
  "SMS & OTP Verification",
  "Payment Gateway Integration",
  "Admin Dashboard / CMS",
  "Analytics & Tracking",
  "Social Media Login",
  "SEO Optimization",
  "Multi-language Support",
  "Push Notifications",
  "Third-party API Integrations"
];

const AdminQuoteCreate = () => {
  const navigate = useNavigate();
  const { adminProfile } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    service: "",
    currency: "INR",
    budget: "",
    timeline: "",
    projectTitle: "",
    projectDescription: "",
    referenceLinks: "",
    facilities: [],
    status: "Pending"
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://backend-code-k530rfj5r-solve-with-you.vercel.app/api/services/public");
        const servicesData = await res.json();
        if (servicesData.success) {
          setServicesList(servicesData.data);
        }
      } catch (error) {
        toast.error("Failed to load services");
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (facility) => {
    setFormData((prev) => {
      const currentFacilities = [...prev.facilities];
      if (currentFacilities.includes(facility)) {
        return { ...prev, facilities: currentFacilities.filter((f) => f !== facility) };
      } else {
        return { ...prev, facilities: [...currentFacilities, facility] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        createdBy: adminProfile?.fullName || "Admin",
        creatorEmployeeId: adminProfile?.employeeCode || ""
      };
      await createAdminQuote(payload);
      toast.success("Quote created successfully");
      navigate("/admin/quotes");
    } catch (error) {
      toast.error("Failed to create quote");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceDetails = servicesList.find(s => s._id === formData.service);

  return (
    <div className="mx-auto w-full max-w-5xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/quotes")}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Create New Quote</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="grid gap-6">
          
          <div className="grid gap-6 sm:grid-cols-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Full Name *</label>
              <input
                type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Email *</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleInputChange} required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Phone *</label>
              <input
                type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Service *</label>
              <select name="service" value={formData.service} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select Service</option>
                {servicesList.map((srv) => (
                  <option key={srv._id} value={srv._id}>{srv.title}</option>
                ))}
              </select>
              {selectedServiceDetails && (
                <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-xl flex gap-2.5 items-start">
                  <Info size={16} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-bold text-teal-900">{selectedServiceDetails.title} <span className="font-normal text-teal-700">({selectedServiceDetails.serviceId})</span></p>
                    <p className="text-[11px] text-teal-800 mt-1">{selectedServiceDetails.description}</p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Budget</label>
              <div className="flex gap-2">
                <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-24 px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">Timeline</label>
              <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1 to 3 months">1 to 3 months</option>
                <option value="3 to 6 months">3 to 6 months</option>
                <option value="6+ months">6+ months</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Project Title *</label>
            <input type="text" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"/>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Project Description *</label>
            <textarea name="projectDescription" value={formData.projectDescription} onChange={handleInputChange} required rows={4} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"/>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Reference Links</label>
            <input type="text" name="referenceLinks" value={formData.referenceLinks} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"/>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-3">Facilities & Features</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {facilitiesOptions.map((facility) => (
                <label key={facility} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${formData.facilities.includes(facility) ? "border-teal-600 bg-teal-50/50" : "border-slate-200"}`}>
                  <input type="checkbox" checked={formData.facilities.includes(facility)} onChange={() => handleFacilityChange(facility)} className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-600"/>
                  <span className="text-[12px] font-medium text-slate-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate("/admin/quotes")} className="px-5 py-2.5 border border-slate-300 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[13px] font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70">
              <Save size={16} /> {submitting ? "Creating..." : "Create Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQuoteCreate;