import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  fetchAdminService,
} from "../services/adminServiceApi";

const formatPrice = (
  value
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );
};

const DetailItem = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-0.5 break-words text-xs font-medium text-slate-700 sm:text-sm">
        {value || "—"}
      </p>
    </div>
  );
};

const ViewServicePage = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const {
    hasPermission,
  } = useAdminAuth();

  const [
    service,
    setService,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadService =
      async () => {
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

  const canEdit =
    hasPermission(
      "services",
      "edit"
    );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              {service.title}
            </h1>

            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                service.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {service.isActive
                ? "Active"
                : "Inactive"}
            </span>

            {service.isPopular && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                Popular
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            Service #
            {
              service.serviceCode
            }
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/services"
            className="rounded-md border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700 sm:text-xs"
          >
            Back
          </Link>

          {canEdit && (
            <Link
              to={`/admin/services/${service._id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white sm:text-xs"
            >
              Edit Service
            </Link>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label="Category"
            value={
              service.category
            }
          />

          <DetailItem
            label="Mode"
            value={
              service.consultationMode.join(
                ", "
              )
            }
          />

          <DetailItem
            label="Duration"
            value={
              service.duration
            }
          />

          <DetailItem
            label="Starting Price"
            value={formatPrice(
              service.startingPrice
            )}
          />

          <DetailItem
            label="Icon Key"
            value={
              service.iconKey
            }
          />

          <DetailItem
            label="Slug"
            value={
              service.slug
            }
          />
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <DetailItem
            label="Short Description"
            value={
              service.shortDescription
            }
          />
        </div>

        <div className="mt-4">
          <DetailItem
            label="Full Description"
            value={
              service.fullDescription
            }
          />
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[10px]">
            Features
          </p>

          {service.features.length >
          0 ? (
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {service.features.map(
                (
                  feature,
                  index
                ) => (
                  <li
                    key={`${feature}-${index}`}
                    className="rounded-md bg-slate-50 px-3 py-2 text-[10px] text-slate-700 sm:text-xs"
                  >
                    {feature}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              No features added.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewServicePage;
