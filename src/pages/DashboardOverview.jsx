import React, { useState, useEffect } from "react";
import { Briefcase, FileText, LifeBuoy, ArrowRight, Clock, FileSignature, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingQuotes: 0,
    openTickets: 0,
    pendingProposals: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("UserAuthToken");
        const userEmail = user?.email || "";
        const userPhone = user?.phone || user?.phoneNumber || "";

        const response = await axios.get(`http://localhost:8000/api/user-dashboard/me?email=${userEmail}&phone=${userPhone}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
        });

        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const getActivityIcon = (type) => {
    if (type === "Project") return <Briefcase size={18} />;
    if (type === "Proposal") return <FileSignature size={18} />;
    if (type === "Ticket") return <LifeBuoy size={18} />;
    return <Quote size={18} />;
  };

  const getActivityColor = (type) => {
    if (type === "Project") return "bg-teal-50 text-teal-600";
    if (type === "Proposal") return "bg-purple-50 text-purple-600";
    if (type === "Ticket") return "bg-amber-50 text-amber-600";
    return "bg-blue-50 text-blue-600";
  };

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Client";

  return (
    <div className="p-6 sm:p-10 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {firstName}!</h1>
      <p className="mt-2 text-sm text-slate-600">Here is a quick overview of your projects, requests, and recent activities.</p>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 h-36" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-100 text-teal-600">
                <Briefcase size={24} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Projects</p>
                <p className="text-2xl font-bold text-slate-900">{stats.activeProjects}</p>
              </div>
            </div>
            <Link to="/projects" className="mt-6 flex items-center justify-between text-sm font-semibold text-teal-600 hover:text-teal-700">
              View all projects <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <FileText size={24} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Quotes</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pendingQuotes}</p>
              </div>
            </div>
            <Link to="/quotes" className="mt-6 flex items-center justify-between text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all quotes <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-purple-300">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-purple-100 text-purple-600">
                <FileSignature size={24} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Proposals</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pendingProposals}</p>
              </div>
            </div>
            <Link to="/myproposals" className="mt-6 flex items-center justify-between text-sm font-semibold text-purple-600 hover:text-purple-700">
              View all proposals <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-300">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <LifeBuoy size={24} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-500">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-900">{stats.openTickets}</p>
              </div>
            </div>
            <Link to="/support" className="mt-6 flex items-center justify-between text-sm font-semibold text-amber-600 hover:text-amber-700">
              View support desk <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h2 className="text-base font-bold text-slate-900">Recent Activity Timeline</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">Loading activity...</div>
        ) : stats.recentActivity.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <Clock size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">No recent activity on your account.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 px-6 py-5 transition hover:bg-slate-50">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                  <Clock size={12} /> {formatTimeAgo(activity.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;