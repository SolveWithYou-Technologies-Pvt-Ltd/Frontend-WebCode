import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await register(formData);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Client Registration
          </h1>
        </div> 
        {errorMessage && (
          <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
            {errorMessage}
          </p>
        )}

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Full name
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder="Enter your full name"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Email address
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Phone number
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength="10"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit phone number"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Password
            </span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                className="h-11 w-full rounded-md border border-slate-300 px-3 pr-11 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 rounded-md bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-600 sm:text-sm">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;