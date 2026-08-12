import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAdminClientById } from "../../api/adminClientApi";

const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await fetchAdminClientById(id);
        setClient(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-10">
        <p className="text-[13px] font-medium text-slate-500">Loading client details...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex w-full flex-col items-center justify-center p-10">
        <p className="text-[13px] font-bold text-red-500 mb-3">Client not found.</p>
        <button 
          onClick={() => navigate("/admin/clients")}
          className="text-[13px] font-semibold text-teal-600 hover:text-teal-800 transition-colors underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Client Details</h1>
        <button
          onClick={() => navigate("/admin/clients")}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm"
        >
          Back to Clients
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.fullName || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Mobile</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.phone || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Company Name</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.companyName || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Designation</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.designation || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Address</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.address || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">City</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.city || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">State</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.state || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Pincode</label>
            <p className="mt-1.5 text-[13px] font-semibold text-slate-900">{client.pincode || "N/A"}</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</label>
            <div className="mt-1.5">
              <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full ${client.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {client.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;