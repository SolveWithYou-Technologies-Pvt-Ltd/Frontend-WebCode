import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Edit, Trash2, Search, Filter, Plus } from "lucide-react";
import useAdminAuth from "../hooks/useAdminAuth";
import { fetchAdminQuotes, updateAdminQuoteStatus, deleteAdminQuote } from "../api/quoteApi";

const ClientQoutes = () => {
  const navigate = useNavigate();
  const { hasPermission, adminProfile } = useAdminAuth();
  
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const cancreate = useMemo(() => hasPermission("quotes", "create"), [hasPermission]);
  const canEdit = useMemo(() => hasPermission("quotes", "edit"), [hasPermission]);
  const canDelete = useMemo(() => hasPermission("quotes", "delete"), [hasPermission]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminQuotes(searchInput, statusFilter);
      setQuotes(data);
    } catch (error) {
      toast.error("Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadQuotes();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAdminQuoteStatus(id, newStatus);
      toast.success("Status updated successfully");
      loadQuotes();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quote request?")) {
      try {
        await deleteAdminQuote(id);
        toast.success("Quote deleted successfully");
        loadQuotes();
      } catch (error) {
        toast.error("Failed to delete quote");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Completed": return "bg-emerald-100 text-emerald-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold text-slate-900">Quotes & Inquiries</h1>
        {cancreate && (
          <button
            onClick={() => navigate("/admin/quotes/add")}
            className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> Create Quote
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex w-full sm:w-auto relative">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input 
            type="text" 
            placeholder="Search by ID, Name, Email..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-slate-300 bg-white rounded-lg pl-8 pr-3 py-1.5 w-full sm:w-72 text-[12px] focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all"
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-[12px] font-medium text-slate-700 flex items-center gap-1"><Filter size={14}/> Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600 transition-all cursor-pointer"
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quote ID & Date</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Info</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Created By</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Requested</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-[12px] font-medium text-slate-500">Loading quotes...</td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-[12px] font-medium text-slate-500">No quotes found matching criteria.</td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="text-[12px] font-bold text-slate-900">{quote.quoteId}</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">{new Date(quote.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="text-[12px] font-bold text-slate-900">{quote.fullName}</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">{quote.email} • {quote.phoneNumber}</div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="text-[12px] font-bold text-slate-900">{quote.createdBy || "User"}</div>
                      {quote.creatorEmployeeId && (
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">Emp ID: {quote.creatorEmployeeId}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-[12px] font-medium text-slate-700">
                      {quote.service?.title || "N/A"}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                        disabled={!canEdit}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-all ${getStatusColor(quote.status)} ${!canEdit && 'opacity-70 cursor-not-allowed'}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-right text-[12px] font-semibold flex justify-end items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/quotes/${quote._id}`)}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      
                      {canEdit && (
                        <button 
                          onClick={() => navigate(`/admin/quotes/edit/${quote._id}`)}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Quote"
                        >
                          <Edit size={14} />
                        </button>
                      )}

                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(quote._id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Quote"
                        >
                          <Trash2 size={14} />
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

export default ClientQoutes;