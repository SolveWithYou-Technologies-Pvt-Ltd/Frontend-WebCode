import {
  PERMISSION_ACTIONS,
  PERMISSION_TABLE,
  createPermissionObject,
  normalizePermissionObject,
} from "../config/permissionTable";

const PermissionTable = ({
  permissions,
  allowedPermissions,
  onChange,
  readOnly = false,
  showOnlyGranted = false,
}) => {
  const selectedPermissions = normalizePermissionObject(permissions);

  const allowed =
    allowedPermissions === undefined
      ? createPermissionObject(true)
      : normalizePermissionObject(allowedPermissions);

  const visibleModules = showOnlyGranted
    ? PERMISSION_TABLE.filter((moduleItem) =>
        PERMISSION_ACTIONS.some(
          (action) => selectedPermissions[moduleItem.key][action.key]
        )
      )
    : PERMISSION_TABLE;

  const updatePermission = (moduleName, actionName, checked) => {
    if (readOnly || !allowed[moduleName]?.[actionName] || typeof onChange !== "function") {
      return;
    }

    onChange({
      ...selectedPermissions,
      [moduleName]: {
        ...selectedPermissions[moduleName],
        [actionName]: checked,
      },
    });
  };

  const updateModule = (moduleName, checked) => {
    if (readOnly || typeof onChange !== "function") {
      return;
    }

    const nextModulePermissions = { ...selectedPermissions[moduleName] };

    PERMISSION_ACTIONS.forEach((action) => {
      if (allowed[moduleName]?.[action.key]) {
        nextModulePermissions[action.key] = checked;
      }
    });

    onChange({
      ...selectedPermissions,
      [moduleName]: nextModulePermissions,
    });
  };

  const updateActionColumn = (actionKey, checked) => {
    if (readOnly || typeof onChange !== "function") {
      return;
    }

    const nextPermissions = { ...selectedPermissions };

    PERMISSION_TABLE.forEach((moduleItem) => {
      if (allowed[moduleItem.key]?.[actionKey]) {
        nextPermissions[moduleItem.key] = {
          ...nextPermissions[moduleItem.key],
          [actionKey]: checked,
        };
      }
    });

    onChange(nextPermissions);
  };

  const updateAllPermissions = (checked) => {
    if (readOnly || typeof onChange !== "function") {
      return;
    }

    const nextPermissions = { ...selectedPermissions };

    PERMISSION_TABLE.forEach((moduleItem) => {
      const nextModulePermissions = { ...nextPermissions[moduleItem.key] };

      PERMISSION_ACTIONS.forEach((action) => {
        if (allowed[moduleItem.key]?.[action.key]) {
          nextModulePermissions[action.key] = checked;
        }
      });

      nextPermissions[moduleItem.key] = nextModulePermissions;
    });

    onChange(nextPermissions);
  };

  const isActionColumnAllSelected = (actionKey) => {
    const allowedModules = PERMISSION_TABLE.filter((m) => allowed[m.key]?.[actionKey]);
    if (allowedModules.length === 0) return false;
    return allowedModules.every((m) => selectedPermissions[m.key]?.[actionKey]);
  };

  const isActionColumnAllowed = (actionKey) => {
    return PERMISSION_TABLE.some((m) => allowed[m.key]?.[actionKey]);
  };

  const isAllModulesAllSelected = () => {
    const allowedModules = PERMISSION_TABLE.filter((m) =>
      PERMISSION_ACTIONS.some((a) => allowed[m.key]?.[a.key])
    );
    if (allowedModules.length === 0) return false;
    return allowedModules.every((m) =>
      PERMISSION_ACTIONS.every(
        (a) => !allowed[m.key]?.[a.key] || selectedPermissions[m.key]?.[a.key]
      )
    );
  };

  const isAllModulesAnyAllowed = () => {
    return PERMISSION_TABLE.some((m) =>
      PERMISSION_ACTIONS.some((a) => allowed[m.key]?.[a.key])
    );
  };

  if (visibleModules.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">
        No permission is assigned.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Module Permissions</h2>

          
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 align-bottom">
                Module
              </th>

              {PERMISSION_ACTIONS.map((action) => (
                <th
                  key={action.key}
                  className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>{action.label}</span>
                    {!readOnly && (
                      <input
                        type="checkbox"
                        checked={isActionColumnAllSelected(action.key)}
                        disabled={!isActionColumnAllowed(action.key)}
                        onChange={(event) => updateActionColumn(action.key, event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        title={`Select all for ${action.label}`}
                      />
                    )}
                  </div>
                </th>
              ))}

              {!readOnly && (
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <span>All</span>
                    <input
                      type="checkbox"
                      checked={isAllModulesAllSelected()}
                      disabled={!isAllModulesAnyAllowed()}
                      onChange={(event) => updateAllPermissions(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                      title="Select all permissions"
                    />
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {visibleModules.map((moduleItem) => {
              const moduleAllowed = PERMISSION_ACTIONS.some(
                (action) => allowed[moduleItem.key]?.[action.key]
              );

              const allAvailableSelected = PERMISSION_ACTIONS.filter(
                (action) => allowed[moduleItem.key]?.[action.key]
              ).every((action) => selectedPermissions[moduleItem.key]?.[action.key]);

              return (
                <tr key={moduleItem.key} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                    {moduleItem.label}
                  </td>

                  {PERMISSION_ACTIONS.map((action) => {
                    const checked = selectedPermissions[moduleItem.key]?.[action.key] === true;
                    const canAssign = allowed[moduleItem.key]?.[action.key] === true;

                    return (
                      <td key={action.key} className="px-4 py-3 text-center">
                        {readOnly ? (
                          <span
                            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                              checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {checked ? "✓" : "—"}
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!canAssign}
                            onChange={(event) =>
                              updatePermission(moduleItem.key, action.key, event.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                          />
                        )}
                      </td>
                    );
                  })}

                  {!readOnly && (
                    <td className="px-4 py-3 text-center bg-slate-50/30">
                      <input
                        type="checkbox"
                        checked={moduleAllowed && allAvailableSelected}
                        disabled={!moduleAllowed}
                        onChange={(event) => updateModule(moduleItem.key, event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        title={`Select all for ${moduleItem.label}`}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionTable;