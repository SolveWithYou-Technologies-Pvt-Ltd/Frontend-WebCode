import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, ArrowUpRight, ArrowDownRight, Filter, Plus, Eye, Edit, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import useAdminAuth from "../hooks/useAdminAuth";
import { fetchTransactions, fetchTransactionStats, deleteTransaction } from "../api/transactionApi";

const AccountsAndBillings = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdminAuth();
  
  const canAdd = useMemo(() => hasPermission("accounts", "create"), [hasPermission]);
  const canEdit = useMemo(() => hasPermission("accounts", "edit"), [hasPermission]);
  const canDelete = useMemo(() => hasPermission("accounts", "delete"), [hasPermission]);

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalCredit: 0, totalExpense: 0, netProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [transData, statsData] = await Promise.all([
        fetchTransactions(startDate, endDate),
        fetchTransactionStats(startDate, endDate)
      ]);
      setTransactions(transData);
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to fetch accounts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        toast.success("Transaction deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="text-teal-600" size={20} />
            Accounts & Billings
          </h1>
        </div>
        {canAdd && (
          <button
            onClick={() => navigate("/admin/accounts/add")}
            className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Transaction
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 mb-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
          <Filter size={14} /> Date Filter:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1.5 border border-slate-300 rounded-md text-[11px] focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <span className="text-slate-400 font-medium text-[11px]">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1.5 border border-slate-300 rounded-md text-[11px] focus:ring-2 focus:ring-teal-500 outline-none"
          />
          {(startDate || endDate) && (
            <button onClick={clearFilters} className="text-[10px] font-bold text-red-500 hover:text-red-700 underline underline-offset-2">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-10"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Credits</p>
          <h2 className="text-xl font-black text-emerald-600 flex items-center gap-1.5">
            {formatCurrency(stats.totalCredit)}
            <ArrowUpRight size={16} className="text-emerald-500 opacity-50" />
          </h2>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Expenses</p>
          <h2 className="text-xl font-black text-red-600 flex items-center gap-1.5">
            {formatCurrency(stats.totalExpense)}
            <ArrowDownRight size={16} className="text-red-500 opacity-50" />
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-teal-500/10 rounded-bl-full -z-10"></div>
          <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1">Net Profit / Loss</p>
          <h2 className="text-xl font-black text-white">
            {formatCurrency(stats.netProfit)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-100">
          <h2 className="text-[13px] font-bold text-slate-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logged By</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-[11px] font-medium text-slate-500">Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-[11px] font-medium text-slate-500">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2 whitespace-nowrap text-[11px] font-semibold text-slate-700">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-slate-400"/>
                        {new Date(t.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-[9px] uppercase tracking-wider font-bold rounded-md ${
                        t.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-[11px] font-bold text-slate-900">{t.category}</td>
                    <td className="px-4 py-2 text-[11px] text-slate-600 max-w-[150px] truncate" title={t.description}>{t.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-[11px] font-bold text-slate-900">{formatCurrency(t.amount)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-[11px] font-bold text-slate-900">{t.createdBy.fullName}</p>
                      <p className="text-[9px] text-slate-500 font-medium">{t.createdBy.employeeCode ? `Emp ID: ${t.createdBy.employeeCode}` : 'Admin'}</p>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right flex justify-end items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/accounts/${t._id}`)}
                        className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      {canEdit && (
                        <button 
                          onClick={() => navigate(`/admin/accounts/edit/${t._id}`)}
                          className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                      )}
                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={14} />
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
    </div>
  );
};

export default AccountsAndBillings;