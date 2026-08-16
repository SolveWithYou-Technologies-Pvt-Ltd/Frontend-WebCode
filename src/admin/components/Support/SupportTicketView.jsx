import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Ticket, Calendar, ShieldAlert, Briefcase, User, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminTicketById } from "../../api/ticketApi";

const SupportTicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await fetchAdminTicketById(id);
        setTicket(data);
      } catch (error) {
        toast.error("Failed to load ticket details");
        navigate("/admin/tickets");
      } finally {
        setLoading(false);
      }
    };
    loadTicket();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-10 text-center text-[13px] font-medium text-slate-500">Loading details...</div>;
  }

  if (!ticket) return null;

  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/tickets"
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ticket Details</h1>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">{ticket.ticketId}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
          ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {ticket.status}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Ticket size={18} className="text-teal-600" />
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">Subject</h2>
          </div>
          <p className="text-lg font-bold text-slate-900">{ticket.subject}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-5 border-y border-slate-100">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Briefcase size={12}/> Project Title</p>
            <p className="mt-1 text-[13px] font-semibold text-slate-900">{ticket.project?.title || "N/A"}</p>
            {ticket.project?.projectId && <p className="text-[11px] text-slate-500">{ticket.project.projectId}</p>}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><User size={12}/> Client Name</p>
            <p className="mt-1 text-[13px] font-semibold text-slate-900">{ticket.project?.clientName || "N/A"}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Priority</p>
            <span className={`mt-1 inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md ${
              ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
              ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              ticket.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {ticket.priority}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Calendar size={12}/> Created On</p>
            <p className="mt-1 text-[13px] font-medium text-slate-700">{new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Calendar size={12}/> Last Updated</p>
            <p className="mt-1 text-[13px] font-medium text-slate-700">{new Date(ticket.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={18} className="text-teal-600" />
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">Description</h2>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketView;