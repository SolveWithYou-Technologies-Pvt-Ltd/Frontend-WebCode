import {
  Link,
} from "react-router-dom";

import AdminAvatar from "../components/AdminAvatar";
import AuditDetails from "../components/AuditDetails";
import PermissionTable from "../components/PermissionTable";
import ProfileDetailsSections from "../components/ProfileDetailsSections";

import useAdminAuth from "../hooks/useAdminAuth";

import {
  useSyncedAdminProfile,
} from "../utils/adminProfileSync";

const AdminProfilePage = () => {
  const {
    adminProfile,
  } = useAdminAuth();

  const displayProfile =
    useSyncedAdminProfile(
      adminProfile
    );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AdminAvatar
            user={displayProfile}
            sizeClass="h-16 w-16 sm:h-20 sm:w-20"
            textClass="text-lg sm:text-xl"
          />

          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              My Profile
            </h1>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              View your complete profile information.
            </p>
          </div>
        </div>

        <Link
          to="/admin/profile/edit"
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white sm:text-sm"
        >
          Edit Profile
        </Link>
      </div>

      <ProfileDetailsSections
        user={displayProfile}
      />

      <div className="mt-5">
        <AuditDetails
          user={displayProfile}
          currentUserId={
            adminProfile?._id
          }
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
        <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">
          My Permissions
        </h2>

        {adminProfile?.role ===
        "superadmin" ? (
          <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 sm:text-sm">
            Superadmin has full access to every module.
          </p>
        ) : (
          <PermissionTable
            permissions={
              adminProfile?.permissions
            }
            readOnly
            showOnlyGranted
          />
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
