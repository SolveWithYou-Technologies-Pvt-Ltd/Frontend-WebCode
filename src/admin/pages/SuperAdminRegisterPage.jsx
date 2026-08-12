import { useState } from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import useAdminAuth from "../hooks/useAdminAuth";

const SuperAdminRegisterPage = () => {
  const navigate = useNavigate();

  const {
    adminProfile,
    authLoading,
    registerSuperAdmin,
  } = useAdminAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  if (authLoading) {
    return null;
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Password and confirm password do not match"
      );
      return;
    }

    setSubmitting(true);

    try {
      await registerSuperAdmin({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      navigate("/admin", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to register superadmin"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Register superadmin
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          This public registration works only once.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            minLength={6}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            minLength={6}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting
              ? "Creating account..."
              : "Create superadmin"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link
            to="/admin/login"
            className="font-semibold text-blue-600"
          >
            Go to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SuperAdminRegisterPage;
