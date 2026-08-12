import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import adminApi from "../api/adminApi";

import {
  getAdminToken,
  removeAdminToken,
  saveAdminToken,
} from "../api/adminToken";

import { normalizePermissionObject } from "../config/permissionTable";

export const AdminAuthContext = createContext(null);

const extractToken = (response) => {
  return response.data?.data?.token || null;
};

const extractProfile = (response) => {
  return response.data?.data?.profile || null;
};

const cleanProfile = (profile) => {
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    permissions: normalizePermissionObject(profile.permissions),
  };
};

export const AdminAuthProvider = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const clearSession = useCallback(() => {
    removeAdminToken();
    setAdminProfile(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    const response = await adminApi.get("/auth/profile");
    const profile = cleanProfile(extractProfile(response));

    if (!profile) {
      throw new Error("Admin profile was not returned");
    }

    setAdminProfile(profile);

    return profile;
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getAdminToken();

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        await fetchProfile();
      } catch (error) {
        clearSession();
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [clearSession, fetchProfile]);

  const login = async ({ email, password }) => {
    const response = await adminApi.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    const token = extractToken(response);

    if (!token) {
      throw new Error("Admin token was not returned");
    }

    saveAdminToken(token);

    try {
      return await fetchProfile();
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const registerSuperAdmin = async (formData) => {
    const response = await adminApi.post("/auth/register-superadmin", formData);

    const token = extractToken(response);

    if (!token) {
      throw new Error("Admin token was not returned");
    }

    saveAdminToken(token);

    try {
      return await fetchProfile();
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const refreshAdminProfile = async () => {
    return fetchProfile();
  };

  const replaceAdminProfile = (profile) => {
    setAdminProfile(cleanProfile(profile));
  };

  const logout = () => {
    clearSession();
  };

  const hasPermission = useCallback(
    (moduleName, action) => {
      if (!adminProfile) {
        return false;
      }

      if (adminProfile.role === "superadmin") {
        return true;
      }

      return adminProfile.permissions?.[moduleName]?.[action] === true;
    },
    [adminProfile],
  );

  const hasAnyPermission = useCallback(
    (permissionList = []) => {
      return permissionList.some(({ moduleName, action }) =>
        hasPermission(moduleName, action),
      );
    },
    [hasPermission],
  );

  const value = useMemo(
    () => ({
      adminProfile,
      adminUser: adminProfile,
      authLoading,
      login,
      registerSuperAdmin,
      refreshAdminProfile,
      replaceAdminProfile,
      logout,
      hasPermission,
      hasAnyPermission,
    }),
    [adminProfile, authLoading, hasPermission, hasAnyPermission],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
