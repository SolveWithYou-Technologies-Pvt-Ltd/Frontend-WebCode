import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { fetchAdminProposalById, updateAdminProposal } from "../../api/proposalApi";

const ProposalEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    validUntil: "",
    totalCost: "",
    estimatedTimeline: "",
    scope: [""],
    milestones: [{ phase: "", amount: "", status: "" }],
    status: "Pending"
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminProposalById(id);
        const formattedDate = new Date(data.validUntil).toISOString().split('T')[0];
        setFormData({
          title: data.title || "",
          validUntil: formattedDate || "",
          totalCost: data.totalCost || "",
          estimatedTimeline: data.estimatedTimeline || "",
          scope: data.scope?.length ? data.scope : [""],
          milestones: data.milestones?.length ? data.milestones : [{ phase: "", amount: "", status: "" }],
          status: data.status || "Pending"
        });
      } catch (error) {
        toast.error("Failed to load proposal");
        navigate("/admin/proposals");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleScopeChange = (index, value) => {
    const newScope = [...formData.scope];
    newScope[index] = value;
    setFormData({ ...formData, scope: newScope });
  };

  const addScopeRow = () => setFormData({ ...formData, scope: [...formData.scope, ""] });
  const removeScopeRow = (index) => {
    if (formData.scope.length === 1) return;
    setFormData({ ...formData, scope: formData.scope.filter((_, i) => i !== index) });
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData({ ...formData, milestones: newMilestones });
  };

  const addMilestoneRow = () => setFormData({ ...formData, milestones: [...formData.milestones, { phase: "", amount: "", status: "" }] });
  const removeMilestoneRow = (index) => {
    if (formData.milestones.length === 1) return;
    setFormData({ ...formData, milestones: formData.milestones.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredScope = formData.scope.filter(s => s.trim() !== "");
    const filteredMilestones = formData.milestones.filter(m => m.phase.trim() !== "" && m.amount.trim() !== "");

    if (filteredScope.length === 0 || filteredMilestones.length === 0) {
      toast.error("Add at least one valid scope and milestone");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        scope: filteredScope,
        milestones: filteredMilestones
      };
      await updateAdminProposal(id, payload);
      toast.success("Proposal updated successfully");
      navigate("/admin/proposals");
    } catch (error) {
      toast.error("Failed to update proposal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10 text-[13px] text-slate-500">Loading editor...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/proposals")}
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Edit Proposal</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Proposal Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Status *</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Valid Until *</label>
              <input type="date" value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Total Cost *</label>
              <input type="text" value={formData.totalCost} onChange={(e) => setFormData({...formData, totalCost: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-bold uppercase text-slate-500 mb-1.5">Est. Timeline *</label>
              <input type="text" value={formData.estimatedTimeline} onChange={(e) => setFormData({...formData, estimatedTimeline: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-[12px] font-bold uppercase text-slate-500 mb-2">Scope of Work *</label>
            {formData.scope.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" value={item} onChange={(e) => handleScopeChange(index, e.target.value)} required className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                <button type="button" onClick={() => removeScopeRow(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={14}/></button>
              </div>
            ))}
            <button type="button" onClick={addScopeRow} className="text-[12px] font-bold text-teal-600 flex items-center gap-1 mt-1"><Plus size={14}/> Add Scope</button>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase text-slate-500 mb-2">Milestones *</label>
            {formData.milestones.map((m, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" value={m.phase} onChange={(e) => handleMilestoneChange(index, 'phase', e.target.value)} required placeholder="Phase/Desc" className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                <input type="text" value={m.amount} onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)} required placeholder="Amount" className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                <input type="text" value={m.status} onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)} required placeholder="Due" className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-teal-500 outline-none" />
                <button type="button" onClick={() => removeMilestoneRow(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={14}/></button>
              </div>
            ))}
            <button type="button" onClick={addMilestoneRow} className="text-[12px] font-bold text-teal-600 flex items-center gap-1 mt-1"><Plus size={14}/> Add Milestone</button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/admin/proposals")} className="px-4 py-2 border border-slate-300 rounded-lg text-[13px] font-bold text-slate-600">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 disabled:opacity-70"><Save size={14}/> Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalEdit;