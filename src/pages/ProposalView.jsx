import { ArrowLeft, FileSignature, Calendar, CheckCircle2, CreditCard, Download, Send } from "lucide-react";
import { Link } from "react-router-dom";

const proposalData = {
  id: "PRP-2026-081",
  title: "Salon Management SaaS Platform",
  date: "Aug 06, 2026",
  validUntil: "Aug 20, 2026",
  totalCost: "$8,500",
  estimatedTimeline: "12 Weeks",
  scope: [
    "Custom UI/UX Design for Web and Mobile App",
    "Admin Dashboard for Salon Owners (Billing, Analytics)",
    "Cross-platform Mobile App (iOS & Android) for Customers",
    "Google Play Console & Apple App Store Publishing",
    "Secure Payment Gateway Integration (Stripe/Razorpay)",
  ],
  milestones: [
    { phase: "Phase 1: UI/UX Design & Prototyping", amount: "$2,000", status: "Upon Signing" },
    { phase: "Phase 2: Core Backend & Web Dashboard", amount: "$3,000", status: "Week 6" },
    { phase: "Phase 3: Mobile App Development & Testing", amount: "$2,500", status: "Week 10" },
    { phase: "Phase 4: App Publishing & Handover", amount: "$1,000", status: "Week 12" },
  ]
};

const ProposalView = () => {
  return (
    <div className="p-6 sm:p-10 mx-auto max-w-5xl">
      <Link to="/quotes" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-6 sm:px-10 sm:py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <FileSignature className="text-teal-600" size={24} />
              <h1 className="text-2xl font-bold text-slate-900">Official Proposal</h1>
            </div>
            <p className="mt-2 text-sm text-slate-600">{proposalData.title} • Ref: {proposalData.id}</p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-sm">
            <span className="font-medium text-slate-500">Date: <span className="font-semibold text-slate-900">{proposalData.date}</span></span>
            <span className="font-medium text-slate-500">Valid Until: <span className="font-semibold text-slate-900">{proposalData.validUntil}</span></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          <div className="p-6 sm:p-10 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Scope of Work</h2>
            <ul className="space-y-4">
              {proposalData.scope.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-bold text-slate-900 mt-10 mb-6">Project Timeline & Milestones</h2>
            <div className="space-y-4">
              {proposalData.milestones.map((milestone, idx) => (
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
              <h2 className="text-lg font-bold text-slate-900 mb-6">Investment Summary</h2>
              
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

            <div className="mt-10 space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
                <CheckCircle2 size={18} />
                Accept Proposal
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <Send size={18} />
                Request Changes
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 mt-2">
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalView;