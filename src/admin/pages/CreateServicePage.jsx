import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import AdminServiceForm, {
  getEmptyServiceForm,
} from "../components/AdminServiceForm";

import {
  createAdminService,
} from "../services/adminServiceApi";

const CreateServicePage = () => {
  const navigate =
    useNavigate();

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const handleSubmit =
    async (serviceData) => {
      setSubmitting(true);
      setError("");

      try {
        const service =
          await createAdminService(
            serviceData
          );

        navigate(
          `/admin/services/${service._id}`,
          {
            replace: true,
          }
        );
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to add service"
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
          Create Service
        </h1>

        <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
          Add a clinic, video or home-sample service.
        </p>
      </div>

      <AdminServiceForm
        initialValues={
          getEmptyServiceForm()
        }
        submitting={
          submitting
        }
        submitLabel="Create Service"
        error={error}
        onSubmit={
          handleSubmit
        }
        onCancel={() =>
          navigate(
            "/admin/services"
          )
        }
      />
    </div>
  );
};

export default CreateServicePage;
