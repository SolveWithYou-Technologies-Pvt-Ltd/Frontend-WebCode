import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import useAdminAuth from "../hooks/useAdminAuth";
import logo from "../../assets/logo.png";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminProfile, authLoading, login } = useAdminAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent animate-spin"></span>
        </div>
      </div>
    );
  }

  if (adminProfile) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(formData);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to login"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans selection:bg-teal-100">
      <div className="w-full max-w-[440px] rounded-md border border-slate-100 bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-full mb-3 px-4">
            <img 
              src={logo} 
              alt="Solve With You Logo" 
              className="h-12 sm:h-14 w-auto object-contain" 
            />
          </div>
          <p className="text-sm">
            Admin Login
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] font-semibold text-red-700 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-400 placeholder:font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3.5 pl-4 pr-12 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-400 placeholder:font-medium"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex w-10 items-center justify-center text-slate-400 transition-colors hover:text-teal-600 rounded-lg"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 rounded-xl bg-teal-600 px-4 py-3.5 text-[13px] font-bold text-white transition-all hover:bg-teal-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 flex justify-center items-center gap-2 shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;