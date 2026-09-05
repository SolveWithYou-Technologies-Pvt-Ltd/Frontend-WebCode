import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users, Briefcase, FileText, Ticket, UserCheck,
  Calendar, ShieldCheck, Target, Layers, FileSignature, ChevronDown
} from "lucide-react";
import useAdminAuth from "../hooks/useAdminAuth";
import { useSyncedAdminProfile } from "../utils/adminProfileSync";

const AdminDashboardPage = () => {
  const { adminProfile } = useAdminAuth();
  const displayProfile = useSyncedAdminProfile(adminProfile);

  const [filter, setFilter] = useState("completely");
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    projects: 0,
    quotes: 0,
    proposals: 0,
    tickets: 0,
    jobs: 0,
    applications: 0,
    services: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("AdminLoginToken");
        const response = await axios.get(
          `https://backendapi.solvewithyou.in/api/dashboard/stats?filter=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data.summary);
        setChartData(response.data.chartData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filter]);

  const statCards = [
    { title: "Client Quotes", value: stats.quotes, icon: FileText, bg: "bg-amber-50", text: "text-amber-600" },
    { title: "Proposals Sent", value: stats.proposals, icon: FileSignature, bg: "bg-indigo-50", text: "text-indigo-600" },
    { title: "Active Projects", value: stats.projects, icon: Briefcase, bg: "bg-emerald-50", text: "text-emerald-600" },
    { title: "Support Tickets", value: stats.tickets, icon: Ticket, bg: "bg-rose-50", text: "text-rose-600" },
    { title: "Services Listed", value: stats.services, icon: Layers, bg: "bg-fuchsia-50", text: "text-fuchsia-600" },
    { title: "Job Openings", value: stats.jobs, icon: Target, bg: "bg-cyan-50", text: "text-cyan-600" },
    { title: "Job Applications", value: stats.applications, icon: UserCheck, bg: "bg-violet-50", text: "text-violet-600" },
    { title: "Total Clients", value: stats.users, icon: Users, bg: "bg-blue-50", text: "text-blue-600" },
    { title: "Admin & Staff", value: stats.admins, icon: ShieldCheck, bg: "bg-slate-100", text: "text-slate-700" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen font-sans selection:bg-indigo-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {displayProfile?.fullName || "Admin"}
          </h1>
          <p className="text-slate-500 font-medium text-[13px] md:text-sm">
            Here's what's happening with your platform today.
          </p>
        </div>

        <div className="relative inline-block w-full md:w-auto">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 group-hover:text-indigo-500 transition-colors" />
            <select
              className="bg-transparent border-none outline-none text-slate-700 font-semibold text-[13px] cursor-pointer appearance-none pr-8 w-full z-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="daily">Today's Data</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="completely">All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none group-hover:text-slate-600" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh] w-full">
          <div className="relative flex h-10 w-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent animate-spin"></span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group cursor-default"
                >
                  <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-[2] ${card.bg}`} />

                  <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[22px] font-bold text-slate-800 tracking-tight leading-none">{card.value}</p>
                      <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.title}</h3>
                    </div>
                    <div className={`p-2.5 rounded-lg ${card.bg} ${card.text} border border-white/50 backdrop-blur-sm group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Growth Analytics</h2>
                <p className="text-[12px] text-slate-500 mt-0.5 font-medium">Tracking core metrics across your timeline</p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="date"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                        fontWeight: "500",
                        fontSize: "12px",
                        color: "#1E293B",
                        padding: "8px 12px"
                      }}
                      itemStyle={{ fontWeight: "600", padding: "2px 0" }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: "600", color: "#64748B" }}
                    />
                    <Area type="monotone" dataKey="users" name="Clients" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" activeDot={{ r: 5, strokeWidth: 0, fill: '#4F46E5' }} />
                    <Area type="monotone" dataKey="projects" name="Projects" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProjects)" activeDot={{ r: 5, strokeWidth: 0, fill: '#10B981' }} />
                    <Area type="monotone" dataKey="quotes" name="Quotes" stroke="#F59E0B" strokeWidth={2} fill="none" activeDot={{ r: 5, strokeWidth: 0, fill: '#F59E0B' }} />
                    <Area type="monotone" dataKey="proposals" name="Proposals" stroke="#8B5CF6" strokeWidth={2} fill="none" activeDot={{ r: 5, strokeWidth: 0, fill: '#8B5CF6' }} />
                    <Area type="monotone" dataKey="tickets" name="Tickets" stroke="#F43F5E" strokeWidth={2} fill="none" activeDot={{ r: 5, strokeWidth: 0, fill: '#F43F5E' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Target className="w-10 h-10 mb-3 text-slate-300" />
                  <p className="font-semibold text-sm text-slate-500">No data available for this timeframe</p>
                  <p className="text-[12px] mt-1">Try adjusting your filters above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;