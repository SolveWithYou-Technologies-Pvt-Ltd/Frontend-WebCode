import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, User, Tag, Hash, Edit } from "lucide-react";
import toast from "react-hot-toast";
import useAdminAuth from "../../hooks/useAdminAuth";
import { fetchTransactionById } from "../../api/transactionApi";

const TransactionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();
  const canEdit = useMemo(() => hasPermission("accounts", "edit") || true, [hasPermission]);
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const data = await fetchTransactionById(id);
        setTransaction(data);
      } catch (error) {
        toast.error("Failed to load transaction details");
        navigate("/admin/accounts");
      } finally {
        setLoading(false);
      }
    };
    loadTransaction();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-10 text-center text-[11px] font-medium text-slate-500">Loading details...</div>;
  }

  if (!transaction) return null;

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/accounts"
            className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Transaction Details</h1>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">ID: {transaction._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
            transaction.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {transaction.type}
          </span>
          {canEdit && (
            <Link
              to={`/admin/accounts/edit/${transaction._id}`}
              className="p-1.5 bg-white border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
              title="Edit Transaction"
            >
              <Edit size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount</p>
          <h2 className={`text-3xl font-black ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1"><Calendar size={12}/> Date</p>
              <p className="text-[12px] font-bold text-slate-900">{new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1"><Tag size={12}/> Category</p>
              <p className="text-[12px] font-bold text-slate-900">{transaction.category}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1"><Hash size={12}/> Reference / Invoice</p>
              <p className="text-[12px] font-bold text-slate-900">{transaction.reference || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1"><User size={12}/> Logged By</p>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p className="text-[11px] font-bold text-slate-900">{transaction.createdBy.fullName}</p>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{transaction.createdBy.employeeCode ? `Emp ID: ${transaction.createdBy.employeeCode}` : 'Admin User'}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1"><FileText size={12}/> Description</p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[11px] font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{transaction.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionView;