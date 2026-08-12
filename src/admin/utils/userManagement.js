export const roleConfig = {
  admin: {
    singular: "Admin",
    plural: "Admins",
    basePath: "/admin/admins",
    permissionPrefix: "admins",
  },

  employee: {
    singular: "Employee",
    plural: "Employees",
    basePath: "/admin/employees",
    permissionPrefix: "employees",
  },
};

export const getRoleConfig = (role) => {
  return roleConfig[role] || roleConfig.employee;
};
