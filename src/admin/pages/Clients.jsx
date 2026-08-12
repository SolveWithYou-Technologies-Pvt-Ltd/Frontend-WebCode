import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  fetchAdminClients, 
  changeClientStatus,
  removeAdminClient
} from "../api/adminClientApi";
import useAdminAuth from "../hooks/useAdminAuth";

const Clients = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const canAdd = useMemo(() => 
    hasPermission("client", "create") || hasPermission("clients", "create"), 
  [hasPermission]);
  
  const canEdit = useMemo(() => 
    hasPermission("client", "edit") || hasPermission("clients", "edit"), 
  [hasPermission]);
  
  const canDelete = useMemo(() => 
    hasPermission("client", "delete") || hasPermission("clients", "delete"), 
  [hasPermission]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await fetchAdminClients({ 
        page, 
        limit: 10, 
        search: searchInput,
        status: statusFilter
      });
      
      const fetchedClients = response?.clients || response?.data?.clients || [];
      const paginationData = response?.pagination || response?.data?.pagination;

      setClients(fetchedClients);
      
      if (paginationData) {
        setTotalPages(paginationData.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadClients();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchInput, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleToggleStatus = async (id) => {
    try {
      await changeClientStatus(id);
      loadClients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await removeAdminClient(id);
        loadClients();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex w-full flex-col p-2 sm:p-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-slate-900">Clients Management</h1>
        {canAdd && (
          <button
            onClick={() => navigate("/admin/clients/add")}
            className="bg-teal-600 text-white px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            Add New Client
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto gap-2">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchInput}
            onChange={handleSearchChange}
            className="border border-slate-300 bg-slate-50 rounded-xl px-3 py-2 w-full sm:w-72 text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-700">Status:</span>
          <select 
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-slate-300 bg-slate-50 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-[13px] font-medium text-slate-500">Loading clients...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-[13px] font-medium text-slate-500">No clients found matching the criteria.</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-[13px] font-bold text-slate-900">{client.fullName}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-[13px] font-medium text-slate-600">{client.email}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-[13px] font-medium text-slate-600">{client.phone}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full ${client.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {client.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-5 py-3 whitespace-nowrap text-right text-[13px] font-semibold flex justify-end items-center gap-3">
                      <button 
                        onClick={() => navigate(`/admin/clients/${client._id}`)}
                        className="text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        View
                      </button>
                      
                      {canEdit && (
                        <button 
                          onClick={() => navigate(`/admin/clients/${client._id}/edit`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                      )}

                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(client._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap text-center text-[13px]">
                      {canEdit && (
                        <button 
                          onClick={() => handleToggleStatus(client._id)}
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                            client.isActive 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {client.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && clients.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Previous
            </button>
            <span className="text-[13px] font-medium text-slate-600">
              Page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;