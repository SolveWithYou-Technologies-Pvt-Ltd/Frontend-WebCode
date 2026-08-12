import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import useAdminAuth from "../hooks/useAdminAuth";
import { useSyncedAdminProfile } from "../utils/adminProfileSync";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { adminProfile, hasPermission, logout } = useAdminAuth();

  const displayProfile = useSyncedAdminProfile(adminProfile);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleLogout = () => {
    logout();

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar
        adminProfile={adminProfile}
        hasPermission={hasPermission}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="min-h-screen md:pl-56 lg:pl-64">
        <AdminNavbar
          displayProfile={displayProfile}
          onLogout={handleLogout}
          onMenuClick={openSidebar}
        />

        <main className="p-2.5 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
