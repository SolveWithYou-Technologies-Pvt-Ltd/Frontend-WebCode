import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import AdminServiceForm from "../components/AdminServiceForm";

import {
  fetchAdminService,
  updateAdminService,
} from "../services/adminServiceApi";

const EditServicePage = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [
    service,
    setService,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadService =
      async () => {
        setLoading(true);
        setError("");

        try {
          const result =
            await fetchAdminService(
              id
            );

          setService(result);
        } catch (requestError) {
          setError(
            requestError.response?.data
              ?.message ||
              "Unable to load service"
          );
        } finally {
          setLoading(false);
        }
      };

    loadService();
  }, [id]);

  const handleSubmit =
    async (serviceData) => {
      setSubmitting(true);
      setError("");

      try {
        await updateAdminService(
          id,
          serviceData
        );

        navigate(
          `/admin/services/${id}`,
          {
            replace: true,
          }
        );
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to update service"
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <p className="text-xs text-slate-500">
        Loading service...
      </p>
    );
  }

  if (!service) {
    return (
      <div>
        <p className="text-xs text-red-600">
          {error ||
            "Service was not found"}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/services"
            )
          }
          className="mt-3 text-xs font-semibold text-blue-600"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
          Edit Service
        </h1>

        <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
          Update complete service information.
        </p>
      </div>

      <AdminServiceForm
        initialValues={
          service
        }
        submitting={
          submitting
        }
        submitLabel="Save Changes"
        error={error}
        onSubmit={
          handleSubmit
        }
        onCancel={() =>
          navigate(
            `/admin/services/${id}`
          )
        }
      />
    </div>
  );
};

export default EditServicePage;
