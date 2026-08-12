const TeamHierarchyPath = ({
  members = [],
  emptyText = "No reporting manager assigned",
  compact = false,
}) => {
  if (!Array.isArray(members) || members.length === 0) {
    return (
      <span className="text-xs text-slate-400">
        {emptyText}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center ${
        compact ? "gap-1" : "gap-1.5"
      }`}
    >
      {members.map((member, index) => (
        <div
          key={
            member._id ||
            member.employeeCode ||
            member.email
          }
          className="flex items-center gap-1"
        >
          {index > 0 && (
            <span className="text-[10px] text-slate-300">
              →
            </span>
          )}

          <span
            className={`font-medium ${
              member.isActive
                ? "text-slate-700"
                : "text-red-500 line-through"
            } ${compact ? "text-[10px]" : "text-xs"}`}
          >
            {member.fullName}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TeamHierarchyPath;
