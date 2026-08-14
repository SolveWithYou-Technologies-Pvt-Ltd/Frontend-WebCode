import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import useAdminAuth from "../hooks/useAdminAuth";
import { fetchAdminServices, toggleAdminServiceStatus, deleteAdminService } from "../api/serviceApi";

const OurServices = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const canAdd = useMemo(() => hasPermission("Services", "create"), [hasPermission]);
  const canEdit = useMemo(() => hasPermission("Services", "edit"), [hasPermission]);
  const canDelete = useMemo(() => hasPermission("Services", "delete"), [hasPermission]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminServices();
      setServices(data);
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await toggleAdminServiceStatus(id);
      loadServices();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteAdminService(id);
        toast.success("Service deleted successfully");
        loadServices();
      } catch (error) {
        toast.error("Failed to delete service");
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Services</h1>
        {canAdd && (
          <button
            onClick={() => navigate("/admin/services/add")}
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add New Service
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Features Count</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm font-medium text-slate-500">Loading services...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm font-medium text-slate-500">No services found.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{service.serviceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{service.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{service.icon}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{service.features.length} Features</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-[11px] uppercase tracking-wider font-bold rounded-full ${service.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold flex justify-end items-center gap-4">
                      <button 
                        onClick={() => navigate(`/admin/services/${service._id}`)}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {canEdit && (
                        <button 
                          onClick={() => navigate(`/admin/services/edit/${service._id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                      )}

                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {canEdit && (
                        <button 
                          onClick={() => handleToggleStatus(service._id)}
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                            service.isActive 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {service.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
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

export default OurServices;