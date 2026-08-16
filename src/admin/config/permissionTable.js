export const PERMISSION_ACTIONS = [
  {
    key: "create",
    label: "Create",
  },
  {
    key: "view",
    label: "View",
  },
  {
    key: "edit",
    label: "Edit",
  },
  {
    key: "delete",
    label: "Delete",
  },
];

export const PERMISSION_TABLE = [
  {
    key: "dashboard",
    label: "Dashboard",
  },
  {
    key: "admin",
    label: "Admin",
  },
  {
    key: "clients",
    label: "Clients",
  },
  {
    key: "employees",
    label: "Employees",
  },
  {
    key: "projects",
    label: "Projects",
  },
  {
    key: "proposals",
    label: "Proposals",
  },
  {
    key: "quotes",
    label: "Quotes",
  },
  {
    key: "support_tickets",
    label: "Support & Tickets",
  },
  {
    key: "services",
    label: "Services",
  },
  {
    key: "hr",
    label: "HR",
  },
  {
    key: "accounts",
    label: "Accounts",
  },
  {
    key: "sales_marketing",
    label: "Sales & Marketing",
  },
  {
    key: "cms_content",
    label: "Content management",
  },

];

export const createActionPermissions = (value = false) => {
  return PERMISSION_ACTIONS.reduce((actions, action) => {
    actions[action.key] = Boolean(value);

    return actions;
  }, {});
};

export const createPermissionObject = (value = false) => {
  return PERMISSION_TABLE.reduce((permissions, moduleItem) => {
    permissions[moduleItem.key] = createActionPermissions(value);

    return permissions;
  }, {});
};

const applyFlatPermission = (permissions, flatPermission) => {
  if (typeof flatPermission !== "string") {
    return;
  }

  const [moduleName, rawAction] = flatPermission.split(".");

  if (!permissions[moduleName]) {
    return;
  }

  if (permissions[moduleName][rawAction] !== undefined) {
    permissions[moduleName][rawAction] = true;

    return;
  }

  if (["update", "status", "permissions"].includes(rawAction)) {
    permissions[moduleName].edit = true;
    return;
  }

  if (rawAction === "manage") {
    permissions[moduleName].create = true;
    permissions[moduleName].edit = true;
    permissions[moduleName].delete = true;
  }
};

export const normalizePermissionObject = (input) => {
  const permissions = createPermissionObject(false);

  if (Array.isArray(input)) {
    input.forEach((permission) => {
      applyFlatPermission(permissions, permission);
    });

    return permissions;
  }

  if (!input || typeof input !== "object") {
    return permissions;
  }

  PERMISSION_TABLE.forEach((moduleItem) => {
    const modulePermissions = input[moduleItem.key];

    if (!modulePermissions || typeof modulePermissions !== "object") {
      return;
    }

    PERMISSION_ACTIONS.forEach((action) => {
      permissions[moduleItem.key][action.key] =
        modulePermissions[action.key] === true;
    });
  });

  return permissions;
};

const createRoleMask = (targetRole) => {
  const permissionMask = createPermissionObject(true);
  permissionMask.admins = createActionPermissions(false);
  return permissionMask;
};

export const getAssignablePermissionMask = (currentUser, targetRole) => {
  const roleMask = createRoleMask(targetRole);

  if (currentUser?.role === "superadmin") {
    return roleMask;
  }

  const currentPermissions = normalizePermissionObject(
    currentUser?.permissions,
  );

  return PERMISSION_TABLE.reduce((permissionMask, moduleItem) => {
    PERMISSION_ACTIONS.forEach((action) => {
      permissionMask[moduleItem.key][action.key] = Boolean(
        roleMask[moduleItem.key][action.key] &&
        currentPermissions[moduleItem.key][action.key],
      );
    });

    return permissionMask;
  }, createPermissionObject(false));
};

export const countGrantedPermissions = (permissions) => {
  const normalized = normalizePermissionObject(permissions);

  return PERMISSION_TABLE.reduce((total, moduleItem) => {
    const moduleCount = PERMISSION_ACTIONS.filter(
      (action) => normalized[moduleItem.key][action.key],
    ).length;

    return total + moduleCount;
  }, 0);
};
