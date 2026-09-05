import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Edit } from "lucide-react";
import { fetchAdminJobById } from "../../api/jobApi";

const JobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobInfo = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminJobById(id);
        setJob(data);
      } catch (error) {
        toast.error("Failed to fetch job details");
        navigate("/admin/hr/hiring");
      } finally {
        setLoading(false);
      }
    };
    getJobInfo();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center text-slate-600">Loading details...</div>;
  if (!job) return <div className="p-8 text-center text-slate-600">Job not found.</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={() => navigate(`/admin/hiring/edit/${job._id}`)}
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          <Edit size={16} />
          Edit Job
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 inline-flex text-xs uppercase tracking-wider font-bold rounded-full ${job.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {job.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {job.department}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
          <p className="text-slate-500 font-medium text-lg">{job.location}</p>
        </div>

        <div className="p-6 sm:p-8 grid gap-8 sm:grid-cols-2 bg-slate-50">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Employment Type</h3>
            <p className="text-base font-semibold text-slate-900">{job.type}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience Required</h3>
            <p className="text-base font-semibold text-slate-900">
              {job.experience === "0" || job.experience === 0 ? "Fresher" : `${job.experience} ${job.experience === "1" || job.experience === 1 ? "Year" : "Years"}`}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vacancies</h3>
            <p className="text-base font-semibold text-slate-900">{job.vacancies}</p>
          </div>

          {job.type === "Internship" ? (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Internship Type</h3>
                <p className="text-base font-semibold text-slate-900">{job.internshipType}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</h3>
                <p className="text-base font-semibold text-slate-900">{job.duration}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PPO Available</h3>
                <p className="text-base font-semibold text-slate-900">{job.promotionAfterInternship}</p>
              </div>
              {job.internshipType === "Paid" && job.stipend && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stipend</h3>
                  <p className="text-base font-semibold text-slate-900">₹{job.stipend.toLocaleString('en-IN')} / month</p>
                </div>
              )}
            </>
          ) : (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Salary Range</h3>
              <p className="text-base font-semibold text-slate-900">
                ₹{job.minSalary?.toLocaleString('en-IN')} - ₹{job.maxSalary?.toLocaleString('en-IN')}
              </p>
            </div>
          )}

          <div className="sm:col-span-2 mt-4 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Created At</h3>
            <p className="text-sm font-medium text-slate-600">{new Date(job.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobView;