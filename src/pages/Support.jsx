import React, { useState, useEffect } from "react";
import { LifeBuoy, Plus, Ticket as TicketIcon, Clock, CheckCircle2, Send, MessageSquare } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Support = () => {
  const { user } = useAuth();
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    projectId: "",
    priority: "low",
    subject: "",
    description: ""
  });

  useEffect(() => {
    const fetchProjectsAndTickets = async () => {
      try {
        const token = localStorage.getItem("UserAuthToken");
        const userEmail = user?.email || "";
        const userPhone = user?.phone || user?.phoneNumber || "";
        const headers = { Authorization: token ? `Bearer ${token}` : "" };

        const projRes = await axios.get(`https://backendapi.solvewithyou.in/api/clientprojects/user/me?email=${userEmail}&phone=${userPhone}`, { headers });
        if (projRes.data && projRes.data.success) {
          const validProjects = projRes.data.data.filter(p => {
            if (!p.supportDuration || p.supportDuration === "None") return false;
            if (!p.supportEndDate) return false;
            return new Date(p.supportEndDate) >= new Date();
          });
          setProjects(validProjects);
        }

        const tickRes = await axios.get(`https://backendapi.solvewithyou.in/api/tickets/user/me?email=${userEmail}&phone=${userPhone}`, { headers });
        if (tickRes.data && tickRes.data.success) {
          setTickets(tickRes.data.data);
        }
      } catch (error) {
        toast.error("Failed to load helpdesk data");
      }
    };

    if (user) {
      fetchProjectsAndTickets();
    }
  }, [user, showNewTicketForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("UserAuthToken");
      const response = await axios.post("https://backendapi.solvewithyou.in/api/tickets", formData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });

      if (response.data.success) {
        setSubmitted(true);
        setFormData({ projectId: "", priority: "low", subject: "", description: "" });
        setTimeout(() => {
          setSubmitted(false);
          setShowNewTicketForm(false);
        }, 3000);
      } else {
        toast.error("Failed to create ticket");
      }
    } catch (error) {
      toast.error("Failed to submit ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

  return (
    <div className="p-6 sm:p-10 mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
            <LifeBuoy className="text-teal-600" size={28} />
            Support Helpdesk
          </h1>
          <p className="mt-2 text-sm text-slate-600">Manage your active projects, raise issues, and track resolutions.</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 shadow-sm"
        >
          {showNewTicketForm ? <TicketIcon size={18} /> : <Plus size={18} />}
          {showNewTicketForm ? "View Active Tickets" : "Raise New Ticket"}
        </button>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-teal-900 p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LifeBuoy size={24} className="text-teal-400" />
            <h3 className="text-lg font-bold">Emergency Support</h3>
          </div>
          <p className="text-sm leading-relaxed text-teal-50 max-w-2xl">
            Is your application facing downtime or a critical failure? Reach out directly to your assigned project manager for an instant resolution.
          </p>
        </div>
        <a
          href="https://wa.me/919005825347"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-teal-900 transition hover:bg-teal-50 shadow-sm"
        >
          <MessageSquare size={18} />
          Live Chat Support
        </a>
      </div>

      <div className="mt-8 space-y-6">
        {showNewTicketForm ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={48} className="text-emerald-500" />
                <h3 className="mt-4 text-xl font-bold text-slate-900">Ticket Submitted Successfully</h3>
                <p className="mt-2 text-sm text-slate-600">Our support team will review this and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900">Create a New Support Ticket</h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Select Project *</span>
                    <select
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
                    >
                      {projects.length === 0 ? (
                        <option value="" disabled>No active support projects available</option>
                      ) : (
                        <>
                          <option value="">Choose project...</option>
                          {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.title} ({p.projectId})</option>
                          ))}
                        </>
                      )}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Priority Level *</span>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
                    >
                      <option value="low">Low - Minor change</option>
                      <option value="medium">Medium - Bug fix</option>
                      <option value="high">High - Feature broken</option>
                      <option value="urgent">Urgent - System down</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Subject *</span>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description of the issue"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Detailed Description *</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Provide as much detail as possible..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
                  />
                </label>

                <button
                  type="submit"
                  disabled={projects.length === 0 || isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 sm:w-auto w-full disabled:opacity-50"
                >
                  <Send size={18} />
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Tickets</h2>
            {tickets.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-500">You haven't raised any support tickets yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between transition hover:border-teal-200">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white shadow-sm text-teal-600">
                        <TicketIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{ticket.subject}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">Project: {ticket.project?.title}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{ticket.ticketId}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(ticket.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'Open' ? 'bg-amber-100 text-amber-700' : ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {ticket.status}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{capitalize(ticket.priority)} Priority</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;