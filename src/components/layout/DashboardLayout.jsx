import { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  LifeBuoy, 
  UserRound, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Globe
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Logo from "../../assets/logo.png";

const sidebarLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Projects", path: "/projects", icon: Briefcase },
  { label: "My Quotes", path: "/quotes", icon: FileText },
  { label: "Support Tickets", path: "/support", icon: LifeBuoy },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
        : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
    }`;

  const userInitial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-100 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-block h-10 min-w-10">
              <img src={Logo} alt="Logo" className="h-full w-auto object-contain object-left" />
            </span>
          
          </Link>
          
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={navLinkClass}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <Link
            to="/profile"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100 transition hover:border-teal-300 hover:bg-teal-50/50"
          >
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" />
            ) : (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-100 font-bold text-teal-700">
                {userInitial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{user?.fullName || "Client"}</p>
              <p className="truncate text-xs text-slate-500 flex items-center gap-1">
                <UserRound size={12} /> View Profile
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden w-full">
        
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link 
              to="/"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              <Globe size={16} />
              Back to Website
            </Link>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;