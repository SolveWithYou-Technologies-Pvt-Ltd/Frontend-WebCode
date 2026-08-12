const pluralRole = (role) => {
  return role === "admin" ? "admins" : "employees";
};

export const staffPermission = (role, action) => {
  return `${pluralRole(role)}.${action}`;
};

export const canManageStaffAction = (
  adminProfile,
  hasPermission,
  role,
  action
) => {
  if (!adminProfile) {
    return false;
  }

  if (adminProfile.role === "superadmin") {
    return true;
  }

  if (
    adminProfile.role !== "admin" ||
    role !== "employee"
  ) {
    return false;
  }

  return hasPermission(
    staffPermission(role, action)
  );
};
