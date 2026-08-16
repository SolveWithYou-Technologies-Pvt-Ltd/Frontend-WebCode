import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Ticket, Calendar, User, Briefcase } from "lucide-react";
import { fetchAdminTicketById, updateAdminTicket } from "../../api/ticketApi";

const SupportTicketEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "low",
    status: "Open"
  });

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await fetchAdminTicketById(id);
        setTicketDetails(data);
        setFormData({
          subject: data.subject || "",
          description: data.description || "",
          priority: data.priority || "low",
          status: data.status || "Open"
        });
      } catch (error) {
        toast.error("Failed to load ticket details");
        navigate("/admin/tickets");
      } finally {
        setLoading(false);
      }
    };
    loadTicket();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateAdminTicket(id, formData);
      toast.success("Ticket updated successfully");
      navigate("/admin/tickets");
    } catch (error) {
      toast.error("Failed to update ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10 text-[13px] text-slate-500">Loading form...</div>;
  }

  if (!ticketDetails) return null;

  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/admin/tickets"
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Ticket</h1>
          <p className="text-[12px] font-medium text-slate-500 mt-0.5">{ticketDetails.ticketId}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Briefcase size={12}/> Project Title</p>
            <p className="mt-1 text-[13px] font-bold text-slate-900">{ticketDetails.project?.title || "N/A"}</p>
            {ticketDetails.project?.projectId && <p className="text-[11px] text-slate-500">{ticketDetails.project.projectId}</p>}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><User size={12}/> Client Name</p>
            <p className="mt-1 text-[13px] font-bold text-slate-900">{ticketDetails.project?.clientName || "N/A"}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Calendar size={12}/> Created On</p>
            <p className="mt-1 text-[13px] font-medium text-slate-700">{new Date(ticketDetails.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Subject *</label>
            <input 
              type="text" 
              value={formData.subject} 
              onChange={(e) => setFormData({...formData, subject: e.target.value})} 
              required 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Priority *</label>
              <select 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value})} 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Status *</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})} 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Description *</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
              rows="6" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none"
            ></textarea>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link to="/admin/tickets" className="px-4 py-2 border border-slate-300 rounded-lg text-[13px] font-bold text-slate-600 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-teal-700 disabled:opacity-70 shadow-sm">
              <Save size={14}/> Update Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportTicketEdit;