import {
  formatActorName,
  formatActivityAction,
  formatAuditDate,
} from "../utils/auditDisplay";

const AuditActor = ({
  actor,
  date,
  currentUserId,
  action,
  emptyText = "Not available",
  compact = false,
}) => {
  if (!actor && !date && !action) {
    return (
      <span className="text-xs text-slate-400">
        {emptyText}
      </span>
    );
  }

  const actorName = formatActorName(
    actor,
    currentUserId
  );

  const dateText = formatAuditDate(date);

  return (
    <div
      className={
        compact
          ? "min-w-36"
          : ""
      }
    >
      {action && (
        <p className="text-xs font-semibold text-slate-700">
          {formatActivityAction(action)}
        </p>
      )}

      <p className="text-xs font-medium capitalize text-slate-700">
        {actorName}
      </p>

      {dateText && (
        <p className="mt-0.5 whitespace-nowrap text-[11px] text-slate-500">
          {dateText}
        </p>
      )}
    </div>
  );
};

export default AuditActor;
