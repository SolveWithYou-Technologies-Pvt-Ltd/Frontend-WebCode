import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { fetchAdminServiceById } from "../../api/serviceApi";

const ServiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminServiceById(id);
        setService(data);
      } catch (error) {
        toast.error("Failed to load service details");
        navigate("/admin/services");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-10 min-h-[60vh]">
        <p className="text-sm font-medium text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (!service) return null;

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
          <h1 className="text-2xl font-bold text-slate-900">Service Details</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{service.title}</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className={`px-3 py-1 inline-flex text-[11px] uppercase tracking-wider font-bold rounded-full ${service.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm font-medium text-slate-500">ID: {service.serviceId}</span>
              <span className="text-sm font-medium text-slate-500">Icon: {service.icon}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</label>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{service.description}</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Included Features</label>
            <div className="grid gap-3">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceView;