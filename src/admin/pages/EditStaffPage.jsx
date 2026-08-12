import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  getStaffForEdit,
  updateStaffUser,
} from "../services/adminStaffService";

import {
  canManageStaffAction,
} from "../utils/staffPermissions";

const EditStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    adminProfile,
    hasPermission,
  } = useAdminAuth();

  const [staffUser, setStaffUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getStaffForEdit(id);

        setStaffUser(user);

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          password: "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load staff details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const canUpdate =
    staffUser &&
    canManageStaffAction(
      adminProfile,
      hasPermission,
      staffUser.role,
      "update"
    );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await updateStaffUser(id, payload);

      navigate(`/admin/staff/${id}`, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update staff details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading staff details...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">
        Edit staff
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Edit permission opens this page. Update permission allows saving.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {staffUser && (
          <div className="rounded-lg bg-slate-50 p-3 text-sm capitalize text-slate-700">
            Role: {staffUser.role}
          </div>
        )}

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
          placeholder="New password (optional)"
          minLength={6}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        />

        {!canUpdate && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            You can open this form, but update permission is not assigned.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/staff")
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting || !canUpdate
            }
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting
              ? "Updating..."
              : "Save updates"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaffPage;
