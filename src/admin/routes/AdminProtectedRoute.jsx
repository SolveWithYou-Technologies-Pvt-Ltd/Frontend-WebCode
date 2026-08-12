import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAdminAuth from "../hooks/useAdminAuth";

const AdminProtectedRoute = ({
  roles,
  moduleName,
  action,
  anyPermissions,
}) => {
  const location = useLocation();

  const {
    adminProfile,
    authLoading,
    hasPermission,
  } = useAdminAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Checking admin session...
          </p>
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (
    roles &&
    !roles.includes(adminProfile.role)
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  if (
    moduleName &&
    action &&
    !hasPermission(moduleName, action)
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  if (
    Array.isArray(anyPermissions) &&
    anyPermissions.length > 0
  ) {
    const hasAnyPermission =
      anyPermissions.some((permission) =>
        hasPermission(
          permission.moduleName,
          permission.action
        )
      );

    if (!hasAnyPermission) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
