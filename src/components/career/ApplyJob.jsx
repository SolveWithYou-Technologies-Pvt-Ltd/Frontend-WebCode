import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2, X } from "lucide-react";
import axios from "axios";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isGeneral = id === "general";
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(!isGeneral);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  
  const [formData, setFormData] = useState({
    appliedRole: "",
    fullName: "",
    email: "",
    phone: "",
    experienceLevel: "Fresher",
    currentSalary: "",
    expectedSalary: "",
    resumeLink: "",
    portfolioLink: "",
    coverLetter: ""
  });

  useEffect(() => {
    if (!isGeneral) {
      const fetchJob = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/jobs/public`);
          const foundJob = response.data.data.find(j => j._id === id);
          if (foundJob) {
            setJob(foundJob);
            setFormData(prev => ({ ...prev, appliedRole: foundJob.title }));
          } else {
            navigate("/careers");
          }
        } catch (error) {
          console.error(error);
          navigate("/careers");
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isGeneral, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        isGeneral,
        jobId: isGeneral ? null : id
      };

      if (payload.experienceLevel === "Fresher") {
        payload.currentSalary = "";
      }

      const response = await axios.post("http://localhost:8000/api/applications", payload);
      setSubmittedId(response.data.data.applicationId);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading application...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Careers
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-12">
          <div className="mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-3">
              {isGeneral ? "Submit Your Resume" : `Apply for ${job?.title}`}
            </h1>
            <p className="text-sm text-slate-500">
              {isGeneral 
                ? "Join our talent pool. We will contact you when a suitable position opens up." 
                : `Fill out the form below to apply for the ${job?.title} position in the ${job?.department} department.`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            
            {isGeneral && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role you are applying for *</label>
                <input
                  type="text"
                  name="appliedRole"
                  value={formData.appliedRole}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. MERN Stack Developer, UX Designer"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Aditya"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="aditya@example.com"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="9005825347"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                >
                  <option value="Fresher">Fresher (0 Years)</option>
                  <option value="Experienced">Experienced (1+ Years)</option>
                </select>
              </div>
            </div>

            {formData.experienceLevel === "Experienced" && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Salary (INR) *</label>
                  <input
                    type="number"
                    name="currentSalary"
                    value={formData.currentSalary}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 400000"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Salary (INR) *</label>
                  <input
                    type="number"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 600000"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>
            )}

            {formData.experienceLevel === "Fresher" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expected Salary (INR) *</label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 300000"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Resume Drive Link *</label>
                <input
                  type="url"
                  name="resumeLink"
                  value={formData.resumeLink}
                  onChange={handleInputChange}
                  required
                  placeholder="Google Drive / Dropbox link"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio / LinkedIn Link</label>
                <input
                  type="url"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/aditya"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter / Why should we hire you?</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={5}
                placeholder="Tell us about your experience and why you are a good fit..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all resize-none"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 shadow-sm disabled:opacity-70"
              >
                <Send size={18} />
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => navigate("/careers")}></div>

          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => navigate("/careers")}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
                <CheckCircle2 size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
              <p className="text-sm font-bold text-teal-600 mb-2">Application ID: {submittedId}</p>
              <p className="text-sm font-medium text-slate-600 mb-6">
                Thank you for applying. Our HR team will review your profile and get back to you soon.
              </p>

              <button
                onClick={() => navigate("/careers")}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 shadow-sm"
              >
                Back to Careers
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ApplyJob;