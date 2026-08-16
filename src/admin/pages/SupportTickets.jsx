import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import useAdminAuth from "../hooks/useAdminAuth";
import { fetchAdminTickets, deleteAdminTicket, updateAdminTicketStatus } from "../api/ticketApi";

const SupportTickets = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();
  
  const canEdit = useMemo(() => hasPermission("support_tickets", "edit"), [hasPermission]);
  const canDelete = useMemo(() => hasPermission("support_tickets", "delete"), [hasPermission]);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminTickets();
      setTickets(data);
    } catch (error) {
      toast.error("Failed to fetch support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAdminTicketStatus(id, newStatus);
      toast.success("Ticket status updated");
      loadTickets();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteAdminTicket(id);
        toast.success("Ticket deleted successfully");
        loadTickets();
      } catch (error) {
        toast.error("Failed to delete ticket");
      }
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      (ticket.ticketId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.project?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.project?.projectId || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="w-full flex flex-col bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Support Tickets</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by ID, title, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
          >
            <option value="All">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Details</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-[12px] font-medium text-slate-500">Loading tickets...</td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-[12px] font-medium text-slate-500">No support tickets found.</td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-[12px] font-bold text-slate-900">{ticket.ticketId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[12px]">
                    <p className="font-bold text-slate-900">{ticket.project?.title || "N/A"}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{ticket.project?.projectId || ""}</p>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-slate-700 max-w-[220px] truncate">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-md ${
                      ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      ticket.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[12px] text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {canEdit ? (
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                        className={`text-[11px] font-bold outline-none cursor-pointer bg-transparent py-1.5 px-2 border rounded-md transition-colors ${
                          ticket.status === 'Resolved' ? 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50' :
                          ticket.status === 'In Progress' ? 'border-blue-300 text-blue-700 bg-white hover:bg-blue-50' :
                          'border-amber-300 text-amber-700 bg-white hover:bg-amber-50'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-md ${
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                        ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ticket.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-[12px] font-semibold flex justify-end items-center gap-3">
                    <button 
                      onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    
                    {canEdit && (
                      <button 
                        onClick={() => navigate(`/admin/tickets/edit/${ticket._id}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                    )}

                    {canDelete && (
                      <button 
                        onClick={() => handleDelete(ticket._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={18} />
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
  );
};

export default SupportTickets;