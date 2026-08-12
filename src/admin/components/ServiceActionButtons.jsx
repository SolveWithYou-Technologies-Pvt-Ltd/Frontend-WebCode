import {
  Link,
} from "react-router-dom";

const ServiceActionButtons = ({
  service,
  canView,
  canEdit,
  canDelete,
  working,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {canView && (
        <Link
          to={`/admin/services/${service._id}`}
          className="rounded border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 sm:text-xs"
        >
          View
        </Link>
      )}

      {canEdit && (
        <>
          <Link
            to={`/admin/services/${service._id}/edit`}
            className="rounded border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 sm:text-xs"
          >
            Edit
          </Link>

          <button
            type="button"
            disabled={working}
            onClick={() =>
              onStatusChange(
                service
              )
            }
            className="rounded border border-amber-200 px-2 py-1 text-[10px] font-semibold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
          >
            {service.isActive
              ? "Deactivate"
              : "Activate"}
          </button>
        </>
      )}

      {canDelete && (
        <button
          type="button"
          disabled={working}
          onClick={() =>
            onDelete(service)
          }
          className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ServiceActionButtons;
