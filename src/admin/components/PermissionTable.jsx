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
  const selectedPermissions =
    normalizePermissionObject(permissions);

  const allowed =
    allowedPermissions === undefined
      ? createPermissionObject(true)
      : normalizePermissionObject(
          allowedPermissions
        );

  const visibleModules = showOnlyGranted
    ? PERMISSION_TABLE.filter(
        (moduleItem) =>
          PERMISSION_ACTIONS.some(
            (action) =>
              selectedPermissions[
                moduleItem.key
              ][action.key]
          )
      )
    : PERMISSION_TABLE;

  const updatePermission = (
    moduleName,
    actionName,
    checked
  ) => {
    if (
      readOnly ||
      !allowed[moduleName]?.[actionName] ||
      typeof onChange !== "function"
    ) {
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

  const updateModule = (
    moduleName,
    checked
  ) => {
    if (
      readOnly ||
      typeof onChange !== "function"
    ) {
      return;
    }

    const nextModulePermissions = {
      ...selectedPermissions[moduleName],
    };

    PERMISSION_ACTIONS.forEach(
      (action) => {
        if (
          allowed[moduleName]?.[
            action.key
          ]
        ) {
          nextModulePermissions[
            action.key
          ] = checked;
        }
      }
    );

    onChange({
      ...selectedPermissions,
      [moduleName]:
        nextModulePermissions,
    });
  };

  const updateAllPermissions = (
    checked
  ) => {
    if (
      readOnly ||
      typeof onChange !== "function"
    ) {
      return;
    }

    const nextPermissions = {
      ...selectedPermissions,
    };

    PERMISSION_TABLE.forEach(
      (moduleItem) => {
        const nextModulePermissions = {
          ...nextPermissions[
            moduleItem.key
          ],
        };

        PERMISSION_ACTIONS.forEach(
          (action) => {
            if (
              allowed[
                moduleItem.key
              ]?.[action.key]
            ) {
              nextModulePermissions[
                action.key
              ] = checked;
            }
          }
        );

        nextPermissions[
          moduleItem.key
        ] = nextModulePermissions;
      }
    );

    onChange(nextPermissions);
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
          <h2 className="text-sm font-bold text-slate-900">
            Module Permissions
          </h2>

          {!readOnly && (
            <p className="mt-1 text-xs text-slate-500">
              Select create, view, edit and delete access.
            </p>
          )}
        </div>

        {!readOnly && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                updateAllPermissions(true)
              }
              className="rounded-md border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-700"
            >
              Select all
            </button>

            <button
              type="button"
              onClick={() =>
                updateAllPermissions(false)
              }
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Module
              </th>

              {PERMISSION_ACTIONS.map(
                (action) => (
                  <th
                    key={action.key}
                    className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
                  >
                    {action.label}
                  </th>
                )
              )}

              {!readOnly && (
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  All
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {visibleModules.map(
              (moduleItem) => {
                const moduleAllowed =
                  PERMISSION_ACTIONS.some(
                    (action) =>
                      allowed[
                        moduleItem.key
                      ]?.[action.key]
                  );

                const allAvailableSelected =
                  PERMISSION_ACTIONS.filter(
                    (action) =>
                      allowed[
                        moduleItem.key
                      ]?.[action.key]
                  ).every(
                    (action) =>
                      selectedPermissions[
                        moduleItem.key
                      ]?.[action.key]
                  );

                return (
                  <tr
                    key={moduleItem.key}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      {moduleItem.label}
                    </td>

                    {PERMISSION_ACTIONS.map(
                      (action) => {
                        const checked =
                          selectedPermissions[
                            moduleItem.key
                          ]?.[
                            action.key
                          ] === true;

                        const canAssign =
                          allowed[
                            moduleItem.key
                          ]?.[
                            action.key
                          ] === true;

                        return (
                          <td
                            key={action.key}
                            className="px-4 py-3 text-center"
                          >
                            {readOnly ? (
                              <span
                                className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                                  checked
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {checked
                                  ? "✓"
                                  : "—"}
                              </span>
                            ) : (
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={
                                  !canAssign
                                }
                                onChange={(
                                  event
                                ) =>
                                  updatePermission(
                                    moduleItem.key,
                                    action.key,
                                    event.target
                                      .checked
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                              />
                            )}
                          </td>
                        );
                      }
                    )}

                    {!readOnly && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={
                            moduleAllowed &&
                            allAvailableSelected
                          }
                          disabled={
                            !moduleAllowed
                          }
                          onChange={(
                            event
                          ) =>
                            updateModule(
                              moduleItem.key,
                              event.target
                                .checked
                            )
                          }
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>
                    )}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionTable;
