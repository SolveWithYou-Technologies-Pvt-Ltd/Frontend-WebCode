import React, { useState, useEffect } from "react";
import { FileSignature, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProposals = async () => {
      try {
        const token = localStorage.getItem("UserAuthToken");
        
        if (!token) {
          setLoading(false);
          return;
        }

        const userEmail = user?.email || "";
        const userPhone = user?.phone || user?.phoneNumber || "";

        const response = await axios.get(`https://backendapi.solvewithyou.in/api/proposals/user/me?email=${userEmail}&phone=${userPhone}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          setProposals(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProposals();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
            <FileSignature className="text-teal-600" size={28} />
            My Proposals
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review the official proposals generated for your project requests.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 py-12 text-center text-sm font-medium text-slate-500">
          Loading your proposals...
        </div>
      ) : proposals.length === 0 ? (
        <div className="mt-8 col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
            <FileSignature size={32} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">No Proposals Found</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            We haven't generated any proposals for your quotes yet. Once they are ready, they will appear here.
          </p>
          <Link
            to="/quotes"
            className="mt-6 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            View Your Quotes
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {proposal.proposalId}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                    proposal.status === "Accepted"
                      ? "bg-emerald-100 text-emerald-700"
                      : proposal.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {proposal.status === "Accepted" && <CheckCircle2 size={12} className="mr-1" />}
                  {proposal.status === "Pending" && <Clock size={12} className="mr-1" />}
                  {proposal.status === "Rejected" && <XCircle size={12} className="mr-1" />}
                  {proposal.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-900">{proposal.title}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Investment:</span>
                    <span className="font-bold text-teal-700">{proposal.totalCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="font-semibold text-slate-700">{proposal.estimatedTimeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Valid Until:</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(proposal.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <Link
                  to={`/proposal/${proposal.quote._id || proposal.quote}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-700 border border-teal-200 transition hover:bg-teal-50"
                >
                  View Proposal Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;