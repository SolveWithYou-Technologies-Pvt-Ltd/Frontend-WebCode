import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Seo from "../../src/Seo/Seo";
import logo from "../assets/logo.png";

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

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((current) => ({
        ...current,
        [name]: numericValue,
      }));
      return;
    }

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
    <>
      <Seo
        title="Create an Account | SolveWithYou Pvt Ltd"
        description="Register for a SolveWithYou client account to start your digital transformation journey, request custom project proposals, and manage your IT services."
        keywords="SolveWithYou registration, create account, IT project portal signup, custom software development, hire developers"
        url="https://www.solvewithyou.in/register"
      />
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Solve With You Logo"
              className="h-10 sm:h-12 w-auto object-contain mb-4"
            />

          </div>

          {errorMessage && (
            <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
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
                placeholder="example@gmail.com"
                pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Please enter a valid Gmail address (e.g. user@gmail.com)"
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
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
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
                  minLength={8}
                  maxLength={15}
                  autoComplete="new-password"
                  placeholder="8 - 15 characters"
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
    </>
  );
};

export default Register;