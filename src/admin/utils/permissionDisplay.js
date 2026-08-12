const actionOrder = [
  "view",
  "create",
  "edit",
  "delete",
  "status",
  "permissions",
];

const groupOrder = [
  "dashboard",
  "services",
  "employees", 
  "admins",
];

const makeTitle = (value) => {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

export const permissionLabel = (permission) => {
  const [, action = permission] = permission.split(".");

  const labels = {
    view: "View",
    create: "Add",
    edit: "Edit",
    delete: "Delete",
    status: "Active / Inactive",
    permissions: "Manage Permissions",
  };

  return labels[action] || makeTitle(action);
};

export const groupPermissions = (permissions = []) => {
  const groups = permissions.reduce(
    (result, permission) => {
      const [moduleName, action] = permission.split(".");

      if (!result[moduleName]) {
        result[moduleName] = [];
      }

      result[moduleName].push({
        permission,
        action,
      });

      return result;
    },
    {}
  );

  return Object.entries(groups)
    .map(([moduleName, items]) => ({
      moduleName,
      title: makeTitle(moduleName),
      items: items.sort(
        (first, second) =>
          actionOrder.indexOf(first.action) -
          actionOrder.indexOf(second.action)
      ),
    }))
    .sort(
      (first, second) =>
        groupOrder.indexOf(first.moduleName) -
        groupOrder.indexOf(second.moduleName)
    );
};
