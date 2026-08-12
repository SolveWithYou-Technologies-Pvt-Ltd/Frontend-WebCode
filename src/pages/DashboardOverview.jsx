import { Briefcase, FileText, LifeBuoy, ArrowRight, Clock, CheckCircle2,FileSignature } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  return (
    <div className="p-6 sm:p-10">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back!</h1>
      <p className="mt-2 text-sm text-slate-600">Here is an overview of your projects and recent activities.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-100 text-teal-600">
              <Briefcase size={24} />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Projects</p>
              <p className="text-2xl font-bold text-slate-900">2</p>
            </div>
          </div>
          <Link to="/projects" className="mt-6 flex items-center justify-between text-sm font-semibold text-teal-600 hover:text-teal-700">
            View all projects <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-600">
              <FileText size={24} />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Quotes</p>
              <p className="text-2xl font-bold text-slate-900">1</p>
            </div>
          </div>
          <Link to="/quotes" className="mt-6 flex items-center justify-between text-sm font-semibold text-teal-600 hover:text-teal-700">
            View all quotes <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-600">
              <LifeBuoy size={24} />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-500">Open Tickets</p>
              <p className="text-2xl font-bold text-slate-900">1</p>
            </div>
          </div>
          <Link to="/support" className="mt-6 flex items-center justify-between text-sm font-semibold text-teal-600 hover:text-teal-700">
            View support desk <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600">
              <CheckCircle2 size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Project Milestone Completed</p>
              <p className="text-xs text-slate-500">UI/UX Design phase for Corporate Website is approved.</p>
            </div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock size={12} /> 2h ago</span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
              <FileSignature size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Proposal Received</p>
              <p className="text-xs text-slate-500">Official proposal sent for Salon Management App.</p>
            </div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock size={12} /> 1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;