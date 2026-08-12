import { useState } from "react";
import { Send, CheckCircle2, Phone, Mail, X } from "lucide-react";

const QuoteFormSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    service: "",
    budget: "",
    projectTitle: "",
    projectDescription: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setQuoteId(data.quoteId);
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setQuoteId("");
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      service: "",
      budget: "",
      projectTitle: "",
      projectDescription: ""
    });
  };

  return (
    <>
      <section className="relative flex min-h-[80vh] items-center justify-center bg-slate-50 py-12 sm:py-20 overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full bg-teal-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 sm:p-12 shadow-sm border border-slate-200">
            
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Request a Free Quote
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
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
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    minLength={10}
                    pattern="[0-9]{10}"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    placeholder="9005825347"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Service *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  >
                    <option value="">Choose a service</option>
                    <option value="app-dev">App Development & Publishing</option>
                    <option value="saas">Custom Software & SaaS Development</option>
                    <option value="web-dev">Web Design & Development</option>
                    <option value="ui-ux">UI/UX & Graphic Design</option>
                    <option value="maintenance">Maintenance & Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Budget (INR / USD)</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                >
                  <option value="">Select estimated budget</option>
                  <option value="tier-1">Less than $1,000 / ₹80,000</option>
                  <option value="tier-2">$1,000 - $5,000 / ₹80k - ₹4L</option>
                  <option value="tier-3">$5,000 - $10,000 / ₹4L - ₹8L</option>
                  <option value="tier-4">$10,000+ / ₹8L+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. E-commerce Mobile App"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project goals, features needed, or timeline..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all resize-none"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 shadow-sm disabled:opacity-70"
                >
                  <Send size={18} />
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleReset}></div>

          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in duration-300">
            <button 
              onClick={handleReset}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
                <CheckCircle2 size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900">Request Submitted!</h3>
              
              <div className="mt-5 w-full rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Request ID</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">{quoteId}</p>
              </div>

              <p className="mt-4 text-sm font-medium text-slate-600">
                Our team will contact you within <span className="font-bold text-slate-900">24 Hours</span>.
              </p>

              <div className="mt-6 w-full rounded-xl bg-slate-900 p-5 text-white text-center">
                <h4 className="text-[11px] font-bold tracking-wider text-teal-400 uppercase mb-4">Contact Us</h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white">
                      <Phone size={14} />
                    </div>
                    <span className="font-semibold">+91 9005825347</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white">
                      <Mail size={14} />
                    </div>
                    <span className="font-semibold">info@digitalservices.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteFormSection;