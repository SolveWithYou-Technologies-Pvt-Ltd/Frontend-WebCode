import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UsersIcon,
  UsersRound,
  Contact,
  Briefcase,
  FileSignature,
  FileText,
  LifeBuoy,
  Box,
  Users,
  Receipt,
  Megaphone,
  LayoutTemplate,
  ShieldCheck,
  Settings,
  X,
  Code
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
    permission: { moduleName: "dashboard", action: "view" },
  },
  {
    label: "Admins",
    path: "/admin/admins",
    icon: UsersIcon,
    allowedRoles: ["superadmin"],
  },
  {
    label: "Employees",
    path: "/admin/employees",
    icon: Contact,
    permission: { moduleName: "employees", action: "view" },
  }, 
  {
    label: "Clients",
    path: "/admin/clients",
    icon: UsersRound,
    permission: { moduleName: "clients", action: "view" },
  },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: Briefcase,
    permission: { moduleName: "projects", action: "view" },
  },
  {
    label: "Proposals",
    path: "/admin/proposals",
    icon: FileSignature,
    permission: { moduleName: "proposals", action: "view" },
  },
  {
    label: "Quotes",
    path: "/admin/quotes",
    icon: FileText,
    permission: { moduleName: "quotes", action: "view" },
  },

  {
    label: "Services",
    path: "/admin/services",
    icon: Box,
    permission: { moduleName: "services", action: "view" },
  },
  {
    label: "Website Content",
    path: "/admin/contentmanagementsystem",
    icon: LayoutTemplate,
    permission: { moduleName: "cms_content", action: "view" },
  },
  {
    label: "HR Module",
    path: "/admin/hr",
    icon: Users,
    permission: { moduleName: "hr", action: "view" },
  },
  {
    label: "Accounts & Billing",
    path: "/admin/accounts",
    icon: Receipt,
    permission: { moduleName: "accounts", action: "view" },
  },
  {
    label: "Sales & Marketing",
    path: "/admin/sales",
    icon: Megaphone,
    permission: { moduleName: "sales_marketing", action: "view" },
  },
  {
    label: "Support Tickets",
    path: "/admin/tickets",
    icon: LifeBuoy,
    permission: { moduleName: "support_tickets", action: "view" },
  },
];

const AdminSidebar = ({ adminProfile, hasPermission, isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const canShowMenuItem = (menuItem) => {
    const currentRole = adminProfile?.role;

    if (currentRole === "superadmin") {
      return true;
    }

    if (menuItem.allowedRoles && !menuItem.allowedRoles.includes(currentRole)) {
      return false;
    }

    if (!menuItem.permission) {
      return true;
    }

    const { moduleName, action } = menuItem.permission;
    return hasPermission(moduleName, action);
  };

  const visibleMenuItems = menuItems.filter(canShowMenuItem);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 md:z-30 md:w-64 md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-600 text-white">
              <Code size={18} />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900">
                Agency Admin
              </h1>
              <p className="truncate text-[10px] text-slate-500">
                Management Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 custom-scrollbar">
          {visibleMenuItems.map((menuItem) => {
            const Icon = menuItem.icon;

            return (
              <NavLink
                key={menuItem.path}
                to={menuItem.path}
                end={menuItem.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-900"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{menuItem.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;