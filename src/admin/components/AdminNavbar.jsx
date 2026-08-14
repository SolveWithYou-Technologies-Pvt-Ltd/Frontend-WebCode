import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminProfileImageUrl } from "../utils/adminProfileImage";

const AdminNavbar = ({ displayProfile, onLogout, onMenuClick }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const imageUrl = getAdminProfileImageUrl(displayProfile?.profileImage);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 lg:h-16 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block shrink-0 h-5 w-5"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="hidden md:block" />

      <div ref={profileMenuRef} className="relative">
        <button
          type="button"
          onClick={() => setProfileMenuOpen((currentValue) => !currentValue)}
          aria-expanded={profileMenuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-slate-100 sm:px-2"
        >
          <div className="hidden min-w-0 text-right sm:block">
            <p className="max-w-40 truncate text-xs font-semibold text-slate-900 lg:text-sm">
              {displayProfile?.fullName || "Admin"}
            </p>
            <p className="text-[10px] capitalize text-slate-500 lg:text-xs">
              {displayProfile?.role || "admin"}
            </p>
          </div>

          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={displayProfile?.fullName || "Admin"}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-8 w-8 lg:h-9 lg:w-9 shrink-0 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div
              title={displayProfile?.fullName || "Admin"}
              className="h-8 w-8 lg:h-9 lg:w-9 grid shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold lg:text-sm"
            >
              {String(displayProfile?.fullName || "")
                .trim()
                .charAt(0)
                .toUpperCase() || "A"}
            </div>
          )}

          <span className="text-slate-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block shrink-0 h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>

        {profileMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
              <p className="truncate text-xs font-semibold text-slate-900">
                {displayProfile?.fullName || "Admin"}
              </p>
              <p className="text-[10px] capitalize text-slate-500">
                {displayProfile?.role || "admin"}
              </p>
            </div>

            <Link
              to="/admin/profile"
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 lg:text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block shrink-0 h-4 w-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0116 0" />
              </svg>
              Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 lg:text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block shrink-0 h-4 w-4"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;