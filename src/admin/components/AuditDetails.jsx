import AuditActor from "./AuditActor";

const AuditDetails = ({
  user,
  currentUserId,
}) => {
  const items = [
    {
      label: "Created By",
      actor: user?.createdBy,
      date: user?.createdAt,
    },
    {
      label: "Updated By",
      actor: user?.updatedBy,
      date: user?.updatedAt,
    },
    {
      label: "Last Recent",
      actor: user?.lastActivity?.by,
      date: user?.lastActivity?.at,
      action: user?.lastActivity?.action,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            {item.label}
          </p>

          <AuditActor
            actor={item.actor}
            date={item.date}
            action={item.action}
            currentUserId={currentUserId}
            emptyText={item.emptyText}
          />
        </div>
      ))}
    </div>
  );
};

export default AuditDetails;
