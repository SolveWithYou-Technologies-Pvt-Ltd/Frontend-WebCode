import { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle2, ArrowRight, Plus, FileSignature, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Closed":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending":
      return <Clock size={14} className="mr-1.5" />;
    case "In Progress":
      return <FileSignature size={14} className="mr-1.5" />;
    case "Completed":
      return <CheckCircle2 size={14} className="mr-1.5" />;
    case "Rejected":
    case "Closed":
      return <AlertCircle size={14} className="mr-1.5" />;
    default:
      return null;
  }
};

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const getQuotes = async () => {
      try {
        const token = localStorage.getItem("token") || 
                      localStorage.getItem("doctorAdminToken") || 
                      localStorage.getItem("UserAuthToken");

        if (!token) {
          toast.error("Authentication Error: No token found");
          setLoading(false);
          return;
        }

        const userEmail = user?.email || "";
        const userPhone = user?.phone || user?.phoneNumber || "";

        const response = await axios.get(`https://backend-code-k530rfj5r-solve-with-you.vercel.app/api/quotes/user/me?email=${userEmail}&phone=${userPhone}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data && response.data.success) {
          setQuotes(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load quotes");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getQuotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
            <FileText className="text-teal-600" size={28} />
            My Quotes
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your service requests, estimated budgets, and project proposals.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 shadow-sm"
        >
          <Plus size={18} />
          Request New Quote
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 py-12 text-center text-sm font-medium text-slate-500">
          Loading your quotes...
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {quotes.length > 0 ? (
            quotes.map((quote) => (
              <div
                key={quote._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {quote.quoteId}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                      quote.status
                    )}`}
                  >
                    {getStatusIcon(quote.status)}
                    {quote.status}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {quote.service?.title || quote.service || "N/A"}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {quote.projectDescription}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">Requested On</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">Est. Budget</span>
                      <span className="font-semibold text-slate-900">
                        {quote.budget ? `${quote.currency === "USD" ? "$" : "₹"}${quote.budget}` : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  {quote.status === "Pending" && (
                    <button
                      disabled
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                    >
                      Proposal Generation in Progress
                    </button>
                  )}
                  
                  {(quote.status === "In Progress" || quote.status === "Closed") && (
                    <Link
                      to={`/proposal/${quote._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-700 border border-teal-200 transition hover:bg-teal-50"
                    >
                      View Proposal
                      <ArrowRight size={16} />
                    </Link>
                  )}

                  {quote.status === "Completed" && (
                    <Link
                      to={`/project/${quote._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                      View Project
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
                <FileText size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No Quotes Found</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                You haven't requested any project quotes yet. Ready to start your digital journey with us?
              </p>
              <Link
                to="/contact"
                className="mt-6 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Request a Quote Now
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quotes;