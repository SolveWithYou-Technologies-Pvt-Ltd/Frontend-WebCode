import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PermissionSelector from "../components/PermissionSelector";

import {
  getStaffPermissionDetails,
  updateStaffPermissions,
} from "../services/adminStaffService";

const EditStaffPermissionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staffUser, setStaffUser] = useState(null);

  const [permissionOptions, setPermissionOptions] =
    useState([]);

  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const details =
          await getStaffPermissionDetails(id);

        setStaffUser(details.user);
        setPermissionOptions(
          details.permissions
        );

        setSelectedPermissions(
          (details.user?.permissions || []).filter(
            (permission) =>
              details.permissions.includes(permission)
          )
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load permissions"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await updateStaffPermissions(
        id,
        selectedPermissions
      );

      navigate(`/admin/staff/${id}`, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update permissions"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading permissions...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Manage permissions
        </h1>

        {staffUser && (
          <p className="mt-1 text-sm text-slate-500">
            {staffUser.fullName} ·{" "}
            {staffUser.email} ·{" "}
            <span className="capitalize">
              {staffUser.role}
            </span>
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <PermissionSelector
          options={permissionOptions}
          selected={selectedPermissions}
          onChange={setSelectedPermissions}
        />

        <div className="mt-6 flex justify-end gap-3">
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
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : "Save permissions"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaffPermissionsPage;
