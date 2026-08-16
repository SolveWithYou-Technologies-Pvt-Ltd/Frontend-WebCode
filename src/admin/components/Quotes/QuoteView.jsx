import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, User, Phone, Mail, FileText, CheckCircle2, Clock, Calendar, CheckSquare, Layers, Plus, X, Send, FileSignature } from "lucide-react";
import { fetchAdminQuoteById, updateAdminQuoteStatus } from "../../api/quoteApi";
import { createAdminProposal, fetchProposalByQuote } from "../../api/proposalApi";
import useAdminAuth from "../../hooks/useAdminAuth";

const QuoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminProfile } = useAdminAuth();
  const [quote, setQuote] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [submittingProposal, setSubmittingProposal] = useState(false);

  const [proposalForm, setProposalForm] = useState({
    title: "",
    validUntil: "",
    totalCost: "",
    estimatedTimeline: "",
    scope: [""],
    milestones: [{ phase: "", amount: "", status: "" }]
  });

  const loadData = async () => {
    try {
      const data = await fetchAdminQuoteById(id);
      setQuote(data);
      
      try {
        const propData = await fetchProposalByQuote(id);
        if (propData.success && propData.data) {
          setProposal(propData.data);
        } else {
          setProposal(null);
        }
      } catch (err) {
        setProposal(null);
      }
    } catch (error) {
      toast.error("Failed to load quote details");
      navigate("/admin/quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  useEffect(() => {
    if (proposalForm.milestones) {
      const total = proposalForm.milestones.reduce((sum, m) => {
        const val = parseFloat(m.amount.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
      
      if (total > 0) {
        const currencyMatch = proposalForm.milestones[0].amount.match(/^[^\d]+/);
        const symbol = currencyMatch ? currencyMatch[0].trim() : 'Rs.';
        setProposalForm(prev => ({
          ...prev,
          totalCost: `${symbol} ${total.toLocaleString('en-IN')}`
        }));
      }
    }
  }, [proposalForm.milestones]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateAdminQuoteStatus(id, newStatus);
      toast.success("Status updated successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleScopeChange = (index, value) => {
    const newScope = [...proposalForm.scope];
    newScope[index] = value;
    setProposalForm({ ...proposalForm, scope: newScope });
  };

  const addScopeRow = () => setProposalForm({ ...proposalForm, scope: [...proposalForm.scope, ""] });
  const removeScopeRow = (index) => {
    if (proposalForm.scope.length === 1) return;
    setProposalForm({ ...proposalForm, scope: proposalForm.scope.filter((_, i) => i !== index) });
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...proposalForm.milestones];
    newMilestones[index][field] = value;
    setProposalForm({ ...proposalForm, milestones: newMilestones });
  };

  const addMilestoneRow = () => setProposalForm({ ...proposalForm, milestones: [...proposalForm.milestones, { phase: "", amount: "", status: "" }] });
  const removeMilestoneRow = (index) => {
    if (proposalForm.milestones.length === 1) return;
    setProposalForm({ ...proposalForm, milestones: proposalForm.milestones.filter((_, i) => i !== index) });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    const filteredScope = proposalForm.scope.filter(s => s.trim() !== "");
    const filteredMilestones = proposalForm.milestones.filter(m => m.phase.trim() !== "" && m.amount.trim() !== "");

    if (filteredScope.length === 0 || filteredMilestones.length === 0) {
      toast.error("Please add at least one scope and one milestone");
      return;
    }

    setSubmittingProposal(true);
    try {
      const payload = {
        ...proposalForm,
        quoteId: id,
        scope: filteredScope,
        milestones: filteredMilestones,
        createdBy: adminProfile?.fullName || "Admin"
      };
      await createAdminProposal(payload);
      toast.success("Proposal generated successfully");
      setShowProposalForm(false);
      loadData();
    } catch (error) {
      toast.error("Failed to generate proposal");
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-10 min-h-[60vh]">
        <p className="text-[13px] font-medium text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="mx-auto w-full max-w-5xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/quotes")}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quote Details</h1>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">ID: {quote.quoteId}</p>
          </div>
        </div>
        <select
          value={quote.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider outline-none cursor-pointer border ${
            quote.status === "Pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
            quote.status === "In Progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
            quote.status === "Completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
            "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-teal-600" /> Project Requirements
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Project Title</label>
                <p className="mt-1 text-[15px] font-bold text-slate-900">{quote.projectTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Timeline</label>
                  <p className="mt-1 text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400"/> {quote.timeline || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Budget Estimate</label>
                  <p className="mt-1 text-[13px] font-semibold text-teal-700 bg-teal-50 inline-block px-3 py-1 rounded-lg">
                    {quote.currency === "USD" ? "$" : "₹"} {quote.budget || "Not specified"}
                  </p>
                </div>
              </div>
              {quote.service && typeof quote.service === 'object' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={16} className="text-teal-600" />
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Requested Service</label>
                  </div>
                  <p className="text-[14px] font-bold text-slate-900">{quote.service.title}</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed mt-1">{quote.service.description}</p>
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Detailed Description</label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">{quote.projectDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {!proposal && !showProposalForm && (
            <div className="bg-teal-50 rounded-2xl border border-teal-100 p-6 sm:p-8 text-center flex flex-col items-center">
              <FileSignature size={32} className="text-teal-600 mb-3" />
              <h3 className="text-lg font-bold text-teal-900">No Proposal Generated</h3>
              <p className="text-[13px] text-teal-700 mt-1 mb-5">Create a formal proposal to send to the client based on these requirements.</p>
              <button 
                onClick={() => setShowProposalForm(true)}
                className="bg-teal-600 text-white px-6 py-2.5 rounded-xl text-[13px] font-bold hover:bg-teal-700 transition-colors shadow-sm"
              >
                Generate Proposal
              </button>
            </div>
          )}

          {proposal && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSignature size={20} className="text-teal-600" /> Generated Proposal
                </h2>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${proposal.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : proposal.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {proposal.status}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Proposal ID</p>
                  <p className="text-[14px] font-bold text-slate-900">{proposal.proposalId}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400">Total Cost</p>
                    <p className="text-[13px] font-bold text-slate-800">{proposal.totalCost}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400">Valid Until</p>
                    <p className="text-[13px] font-bold text-slate-800">{new Date(proposal.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showProposalForm && !proposal && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSignature size={20} className="text-teal-600" /> Create Proposal
                </h2>
                <button onClick={() => setShowProposalForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
              </div>
              <form onSubmit={handleProposalSubmit} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Proposal Title *</label>
                  <input type="text" value={proposalForm.title} onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Valid Until *</label>
                    <input type="date" value={proposalForm.validUntil} onChange={(e) => setProposalForm({...proposalForm, validUntil: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Total Cost *</label>
                    <input type="text" value={proposalForm.totalCost} onChange={(e) => setProposalForm({...proposalForm, totalCost: e.target.value})} placeholder="e.g. $5,000" required readOnly className="w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-lg text-[13px] focus:outline-none cursor-not-allowed text-slate-600 font-semibold" />
                    <p className="text-[10px] text-slate-400 mt-1">Calculated from milestones</p>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Est. Timeline *</label>
                  <input type="text" value={proposalForm.estimatedTimeline} onChange={(e) => setProposalForm({...proposalForm, estimatedTimeline: e.target.value})} placeholder="e.g. 4-6 Weeks" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                
                <div>
                  <label className="block text-[12px] font-bold uppercase text-slate-500 mb-2">Scope of Work *</label>
                  {proposalForm.scope.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input type="text" value={item} onChange={(e) => handleScopeChange(index, e.target.value)} required placeholder={`Scope item ${index + 1}`} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                      <button type="button" onClick={() => removeScopeRow(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={addScopeRow} className="text-[12px] font-bold text-teal-600 flex items-center gap-1 mt-1"><Plus size={14}/> Add Scope</button>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase text-slate-500 mb-2">Milestones *</label>
                  {proposalForm.milestones.map((m, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input type="text" value={m.phase} onChange={(e) => handleMilestoneChange(index, 'phase', e.target.value)} required placeholder="Phase/Desc" className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                      <input type="text" value={m.amount} onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)} required placeholder="Amount (e.g. Rs. 1000)" className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                      <input type="text" value={m.status} onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)} required placeholder="Due" className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                      <button type="button" onClick={() => removeMilestoneRow(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={addMilestoneRow} className="text-[12px] font-bold text-teal-600 flex items-center gap-1 mt-1"><Plus size={14}/> Add Milestone</button>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowProposalForm(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-[13px] font-bold text-slate-600">Cancel</button>
                  <button type="submit" disabled={submittingProposal} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 disabled:opacity-70"><Send size={14}/> Generate</button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <User size={20} className="text-teal-400" /> Client Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Name</p>
                <p className="text-[14px] font-bold mt-1">{quote.fullName}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                <div className="mt-1 flex items-center gap-2 text-[13px] font-medium">
                  <Mail size={14} className="text-slate-400" /> {quote.email}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                <div className="mt-1 flex items-center gap-2 text-[13px] font-medium">
                  <Phone size={14} className="text-slate-400" /> {quote.phoneNumber}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-[14px] font-bold text-slate-900 mb-4">Tracking Info</h2>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Created By</p>
                <p className="text-[13px] font-medium text-slate-700 mt-1">
                  {quote.createdBy || "User"} {quote.creatorEmployeeId ? `(Emp ID: ${quote.creatorEmployeeId})` : ""}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Received On</p>
                <p className="text-[13px] font-medium text-slate-700 mt-1 flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400"/> {new Date(quote.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteView;