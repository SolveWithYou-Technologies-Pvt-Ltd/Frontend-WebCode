import React, { useState, useEffect } from "react";
import { ArrowLeft, FileSignature, Calendar, CheckCircle2, CreditCard, Download, XCircle, CheckSquare } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProposalByQuote, updateProposalStatus } from "../admin/api/proposalApi";

const ProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getProposal = async () => {
      try {
        const response = await fetchProposalByQuote(id);
        if (response.success && response.data) {
          setProposalData(response.data);
        } else {
          setProposalData(null);
        }
      } catch (error) {
        toast.error("Proposal not found or still generating.");
        setProposalData(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      getProposal();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this proposal?`)) return;
    
    setProcessing(true);
    try {
      const res = await updateProposalStatus(proposalData._id, newStatus);
      if (res.success) {
        toast.success(`Proposal ${newStatus.toLowerCase()} successfully!`);
        setProposalData(res.data);
        
        if (newStatus === "Accepted") {
           navigate(`/project/${proposalData.quote}`);
        }
      }
    } catch (err) {
      toast.error("Failed to update proposal status");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-10 min-h-[60vh]">
        <p className="text-[14px] font-medium text-slate-500">Loading proposal details...</p>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <FileSignature size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Proposal Not Available</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md">The proposal for this quote has not been generated yet or could not be found.</p>
        <Link to="/quotes" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 shadow-sm">
          <ArrowLeft size={16} /> Return to Quotes
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 mx-auto max-w-5xl">
      <Link to="/quotes" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Quotes
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-6 sm:px-10 sm:py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <FileSignature className="text-teal-600" size={24} />
              <h1 className="text-2xl font-bold text-slate-900">Official Proposal</h1>
            </div>
            <p className="mt-2 text-sm text-slate-600">{proposalData.title} • Ref: {proposalData.proposalId}</p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-sm">
            <span className="font-medium text-slate-500">Date: <span className="font-semibold text-slate-900">{new Date(proposalData.createdAt).toLocaleDateString()}</span></span>
            <span className="font-medium text-slate-500">Valid Until: <span className="font-semibold text-slate-900">{new Date(proposalData.validUntil).toLocaleDateString()}</span></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-6 sm:p-10 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CheckSquare size={20} className="text-teal-600" /> Scope of Work
            </h2>
            <ul className="space-y-4">
              {proposalData.scope && proposalData.scope.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-bold text-slate-900 mt-10 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-teal-600" /> Project Timeline & Milestones
            </h2>
            <div className="space-y-4">
              {proposalData.milestones && proposalData.milestones.map((milestone, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{milestone.phase}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Due: {milestone.status}</p>
                  </div>
                  <p className="text-sm font-bold text-teal-700 mt-2 sm:mt-0">{milestone.amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Investment Summary</h2>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  proposalData.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : 
                  proposalData.status === "Rejected" ? "bg-red-100 text-red-700" : 
                  "bg-amber-100 text-amber-700"
                }`}>
                  {proposalData.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200">
                  <CreditCard size={20} className="text-teal-600" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total Project Cost</p>
                    <p className="text-lg font-bold text-slate-900">{proposalData.totalCost}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200">
                  <Calendar size={20} className="text-teal-600" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Estimated Timeline</p>
                    <p className="text-lg font-bold text-slate-900">{proposalData.estimatedTimeline}</p>
                  </div>
                </div>
              </div>
            </div>

            {proposalData.status === "Pending" && (
              <div className="mt-10 space-y-3">
                <button 
                  onClick={() => handleStatusUpdate("Accepted")}
                  disabled={processing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-70"
                >
                  <CheckCircle2 size={18} />
                  Accept Proposal
                </button>
                <button 
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={processing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-70"
                >
                  <XCircle size={18} />
                  Reject Proposal
                </button>
              </div>
            )}
            
            {proposalData.status !== "Pending" && (
              <div className="mt-10 space-y-3">
                 <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalView;