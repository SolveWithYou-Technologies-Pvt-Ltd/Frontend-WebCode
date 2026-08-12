import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createAdminClient, updateAdminClient, fetchAdminClientById } from "../../api/adminClientApi";

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    designation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const loadClient = async () => {
        try {
          const clientData = await fetchAdminClientById(id);
          if (clientData) {
            setFormData({
              fullName: clientData.fullName || "",
              email: clientData.email || "",
              phone: clientData.phone || "",
              password: "",
              companyName: clientData.companyName || "",
              designation: clientData.designation || "",
              address: clientData.address || "",
              city: clientData.city || "",
              state: clientData.state || "",
              pincode: clientData.pincode || "",
            });
          }
        } catch (error) {
          toast.error("Failed to load client data");
          console.error(error);
        }
      };
      loadClient();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Strict 10-digit numeric check for Phone field
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (numericValue.length > 10) return; // Prevent typing more than 10 digits
      
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Front-end validation for exactly 10 digits
    if (formData.phone.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateAdminClient(id, formData);
        toast.success("Client updated successfully");
      } else {
        await createAdminClient(formData);
        toast.success("Client added successfully");
      }
      navigate("/admin/clients");
    } catch (error) {
      // Backend error catching for Toast messages (e.g. Email/Phone already exists)
      const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          {isEditMode ? "Edit Client" : "Add New Client"}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Mobile *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          {!isEditMode && (
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/clients")}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[13px] font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update Client" : "Save Client")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;