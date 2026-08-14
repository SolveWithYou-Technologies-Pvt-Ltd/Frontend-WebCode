import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, X, ArrowLeft } from "lucide-react";
import { fetchAdminServiceById, createAdminService, updateAdminService } from "../../api/serviceApi";

const iconOptions = ["Smartphone", "Cloud", "Code", "Palette", "Wrench", "Briefcase", "Globe", "Database", "Shield", "Zap", "Layout"];

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Code",
    features: [""]
  });

  useEffect(() => {
    if (isEditMode) {
      const loadService = async () => {
        try {
          const data = await fetchAdminServiceById(id);
          setFormData({
            title: data.title,
            description: data.description,
            icon: data.icon,
            features: data.features.length > 0 ? data.features : [""]
          });
        } catch (error) {
          toast.error("Failed to load service");
          navigate("/admin/services");
        }
      };
      loadService();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeatureRow = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeatureRow = (index) => {
    if (formData.features.length === 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredFeatures = formData.features.filter(f => f.trim() !== "");
    
    if (filteredFeatures.length === 0) {
      toast.error("Add at least one feature");
      return;
    }

    const payload = { ...formData, features: filteredFeatures };
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateAdminService(id, payload);
        toast.success("Service updated successfully");
      } else {
        await createAdminService(payload);
        toast.success("Service created successfully");
      }
      navigate("/admin/services");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to save service";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/services")}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Service" : "Create New Service"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Service Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Web Design & Development"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Icon *</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all cursor-pointer"
              >
                {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Short Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="A brief overview of the service..."
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Service Features *</label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    required
                    placeholder={`Feature ${index + 1}`}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureRow(index)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shrink-0"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeatureRow}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors"
            >
              <Plus size={16} /> Add Another Feature
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update Service" : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;