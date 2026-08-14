import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  LayoutDashboard,
  X
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../../assets/logo.png";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Services", path: "/services" },
  { label: "Careers", path: "/careers" },
];

const UserAvatar = ({ user, initial, size = "small" }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const sizeClasses = size === "large" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";

  if (user?.profilePhoto && !hasImageError) {
    return (
      <img
        src={user.profilePhoto}
        alt={user?.fullName ? `${user.fullName} profile` : "User profile"}
        onError={() => setHasImageError(true)}
        className={`${sizeClasses} shrink-0 rounded-full border border-teal-100 object-cover`}
      />
    );
  }

  return (
    <span className={`${sizeClasses} grid shrink-0 place-items-center rounded-full bg-teal-100 font-bold text-teal-700`}>
      {initial}
    </span>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const { user, isAuthenticated, isAuthLoading, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-teal-50 text-teal-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    ].join(" ");

  const userInitial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMenus}>
          <span className="inline-block h-10 min-w-10">
            <img src={Logo} alt="Logo" className="h-full w-auto object-contain object-left" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900 sm:text-base">
              SolveWithYou Pvt Ltd
            </p>
            <p className="hidden text-[11px] text-slate-500 sm:block">
              Your Problem - Our Technology - One Solution
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthLoading ? (
            <span className="h-9 w-28 animate-pulse rounded-md bg-slate-100" />
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left transition hover:border-slate-300"
              >
                <UserAvatar user={user} initial={userInitial} />
                <span className="max-w-36">
                  <span className="block truncate text-xs font-semibold text-slate-900">
                    {user?.fullName}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {user?.email}
                  </span>
                </span>
                <ChevronDown size={15} className="text-slate-500" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
                  <Link
                    to="/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard size={16} />
                    Client Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t border-slate-100 pt-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Client Login
              </Link>
              <Link
                to="/contact"
                className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Get a Quote
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid w-full max-w-7xl gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenus}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mx-auto mt-4 w-full max-w-7xl border-t border-slate-100 pt-4">
            {isAuthLoading ? (
              <span className="block h-11 w-full animate-pulse rounded-md bg-slate-100" />
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 mb-4">
                  <UserAvatar user={user} initial={userInitial} size="large" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.fullName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <Link
                  to="/dashboard"
                  onClick={closeMenus}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <LayoutDashboard size={17} />
                  Go to Client Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 mt-2"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="rounded-md border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                >
                  Client Login
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMenus}
                  className="rounded-md bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get a Quote
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;