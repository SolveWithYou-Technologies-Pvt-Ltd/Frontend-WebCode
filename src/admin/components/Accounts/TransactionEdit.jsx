import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { fetchTransactionById, updateTransaction } from "../../api/transactionApi";

const TransactionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "credit",
    amount: "",
    category: "",
    date: "",
    description: "",
    reference: ""
  });

  const categories = {
    credit: ["Project Payment", "Consultation Fee", "Subscription", "Refund", "Other Income"],
    expense: ["Salary", "Software & Tools", "Marketing", "Office Rent", "Equipment", "Utility Bills", "Taxes", "Other Expense"]
  };

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const data = await fetchTransactionById(id);
        setFormData({
          type: data.type,
          amount: data.amount,
          category: data.category,
          date: new Date(data.date).toISOString().split('T')[0],
          description: data.description,
          reference: data.reference || ""
        });
      } catch (error) {
        toast.error("Failed to load transaction details");
        navigate("/admin/accounts");
      } finally {
        setLoading(false);
      }
    };
    loadTransaction();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };

      await updateTransaction(id, payload);
      toast.success("Transaction updated successfully");
      navigate("/admin/accounts");
    } catch (error) {
      toast.error("Failed to update transaction");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-[11px] font-medium text-slate-500">Loading form...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col p-4">
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/admin/accounts"
          className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-slate-900">Edit Transaction</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Transaction Type *</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value, category: ""})} 
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
              >
                <option value="credit">Credit (Income)</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date *</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Amount (Rs) *</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                required 
                placeholder="Enter amount"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-teal-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category *</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                required
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
              >
                <option value="">Select Category...</option>
                {categories[formData.type].map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Reference / Invoice No.</label>
            <input 
              type="text" 
              value={formData.reference} 
              onChange={(e) => setFormData({...formData, reference: e.target.value})} 
              placeholder="e.g. INV-1002"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-teal-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description *</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
              rows="3" 
              placeholder="Enter transaction details..."
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] focus:ring-2 focus:ring-teal-500 outline-none"
            ></textarea>
          </div>
          
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Link to="/admin/accounts" className="px-4 py-1.5 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</Link>
            <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 hover:bg-teal-700 disabled:opacity-70 shadow-sm transition-colors">
              <Save size={14}/> {submitting ? "Updating..." : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionEdit;