import {
  groupPermissions,
  permissionLabel,
} from "../utils/permissionDisplay";

const PermissionSelector = ({
  options,
  selected,
  onChange,
  disabled = false,
}) => {
  const groups = groupPermissions(options);

  const togglePermission = (permission) => {
    if (disabled) {
      return;
    }

    const nextPermissions = selected.includes(permission)
      ? selected.filter((item) => item !== permission)
      : [...selected, permission];

    onChange(nextPermissions);
  };

  const selectGroup = (groupPermissionsList) => {
    const nextPermissions = [
      ...new Set([
        ...selected,
        ...groupPermissionsList,
      ]),
    ];

    onChange(nextPermissions);
  };

  const clearGroup = (groupPermissionsList) => {
    onChange(
      selected.filter(
        (permission) =>
          !groupPermissionsList.includes(permission)
      )
    );
  };

  if (groups.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
        No permission can be assigned for this role.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupPermissionNames = group.items.map(
          (item) => item.permission
        );

        return (
          <section
            key={group.moduleName}
            className="rounded-xl border border-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {group.title}
              </h3>

              {!disabled && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      selectGroup(groupPermissionNames)
                    }
                    className="text-xs font-semibold text-blue-600"
                  >
                    Select group
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      clearGroup(groupPermissionNames)
                    }
                    className="text-xs font-semibold text-slate-500"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <label
                  key={item.permission}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(
                      item.permission
                    )}
                    onChange={() =>
                      togglePermission(item.permission)
                    }
                    disabled={disabled}
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-slate-700">
                    {permissionLabel(item.permission)}
                  </span>
                </label>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default PermissionSelector;
