import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, FileSignature, Calendar, CheckCircle2, User, CheckSquare } from "lucide-react";
import { fetchAdminProposalById } from "../../api/proposalApi";

const AdminProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminProposalById(id);
        setProposal(data);
      } catch (error) {
        toast.error("Failed to load proposal details");
        navigate("/admin/proposals");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-10 min-h-[60vh]">
        <p className="text-[13px] font-medium text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <div className="mx-auto w-full max-w-5xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/proposals")}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proposal Details</h1>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">ID: {proposal.proposalId}</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${
          proposal.status === "Pending" ? "bg-amber-100 text-amber-700" :
          proposal.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
          "bg-red-100 text-red-700"
        }`}>
          {proposal.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileSignature size={20} className="text-teal-600" /> General Info
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Proposal Title</label>
                <p className="mt-1 text-[15px] font-bold text-slate-900">{proposal.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Timeline</label>
                  <p className="mt-1 text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400"/> {proposal.estimatedTimeline}
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Cost</label>
                  <p className="mt-1 text-[13px] font-semibold text-teal-700 bg-teal-50 inline-block px-3 py-1 rounded-lg">
                    {proposal.totalCost}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Valid Until</label>
                <p className="mt-1 text-[13px] font-semibold text-slate-800">
                  {new Date(proposal.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CheckSquare size={20} className="text-teal-600" /> Scope of Work
            </h2>
            <ul className="space-y-4">
              {proposal.scope.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0 mt-0.5" />
                  <span className="text-[13px] leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-teal-600" /> Milestones
            </h2>
            <div className="space-y-4">
              {proposal.milestones.map((milestone, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50">
                  <div>
                    <p className="text-[13px] font-bold text-slate-900">{milestone.phase}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">Due: {milestone.status}</p>
                  </div>
                  <p className="text-[13px] font-bold text-teal-700 mt-2 sm:mt-0">{milestone.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <User size={20} className="text-teal-400" /> Meta Data
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Created By</p>
                <p className="text-[14px] font-bold mt-1">{proposal.createdBy || "Admin"}</p>
                {proposal.creatorEmployeeId && (
                  <p className="text-[12px] text-slate-400 mt-0.5">Emp ID: {proposal.creatorEmployeeId}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Creation Date</p>
                <div className="mt-1 flex items-center gap-2 text-[13px] font-medium">
                  <Calendar size={14} className="text-slate-400" /> {new Date(proposal.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {proposal.quote && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-[14px] font-bold text-slate-900 mb-4">Related Quote</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quote Title</p>
                  <p className="text-[13px] font-bold text-slate-800 mt-1">{proposal.quote.projectTitle}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Info</p>
                  <p className="text-[13px] font-medium text-slate-700 mt-1">{proposal.quote.fullName}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{proposal.quote.email}</p>
                </div>
                <button
                  onClick={() => navigate(`/admin/quotes/${proposal.quote._id}`)}
                  className="mt-2 w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  View Original Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProposalView;