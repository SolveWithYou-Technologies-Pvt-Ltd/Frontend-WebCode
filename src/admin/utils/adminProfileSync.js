import {
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY =
  "doctorAdminProfileDisplay";

const UPDATE_EVENT =
  "doctor-admin-profile-updated";

const getUserId = (user) => {
  return String(
    user?._id ||
    user?.id ||
    ""
  );
};

const createDisplaySnapshot = (
  profile
) => {
  if (!profile) {
    return null;
  }

  const userId =
    getUserId(profile);

  if (!userId) {
    return null;
  }

  /*
    Store only fields required for immediate visual
    refresh. Authorization still comes from the real
    AdminAuthContext profile.
  */
  return {
    _id: userId,

    fullName:
      profile.fullName || "",

    role:
      profile.role || "",

    profileImage:
      profile.profileImage || "",

    updatedAt:
      profile.updatedAt ||
      new Date().toISOString(),
  };
};

const readSnapshot = () => {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const savedValue =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    return savedValue
      ? JSON.parse(savedValue)
      : null;
  } catch {
    return null;
  }
};

export const saveAdminProfileSnapshot = (
  profile
) => {
  const snapshot =
    createDisplaySnapshot(
      profile
    );

  if (
    !snapshot ||
    typeof window ===
      "undefined"
  ) {
    return snapshot;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(snapshot)
    );
  } catch {
    // Display refresh still works through the event.
  }

  window.dispatchEvent(
    new CustomEvent(
      UPDATE_EVENT,
      {
        detail: snapshot,
      }
    )
  );

  return snapshot;
};

export const clearAdminProfileSnapshot =
  () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    try {
      window.localStorage.removeItem(
        STORAGE_KEY
      );
    } catch {
      // Ignore browser storage errors.
    }
  };

export const useSyncedAdminProfile = (
  adminProfile
) => {
  const [
    snapshot,
    setSnapshot,
  ] = useState(() =>
    readSnapshot()
  );

  useEffect(() => {
    const handleProfileUpdate = (
      event
    ) => {
      setSnapshot(
        event.detail ||
        readSnapshot()
      );
    };

    const handleStorage = (
      event
    ) => {
      if (
        event.key ===
        STORAGE_KEY
      ) {
        setSnapshot(
          readSnapshot()
        );
      }
    };

    window.addEventListener(
      UPDATE_EVENT,
      handleProfileUpdate
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        UPDATE_EVENT,
        handleProfileUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  useEffect(() => {
    if (
      !adminProfile ||
      !snapshot
    ) {
      return;
    }

    if (
      getUserId(adminProfile) !==
      getUserId(snapshot)
    ) {
      setSnapshot(null);
    }
  }, [
    adminProfile,
    snapshot,
  ]);

  return useMemo(() => {
    if (!adminProfile) {
      return null;
    }

    if (
      !snapshot ||
      getUserId(adminProfile) !==
        getUserId(snapshot)
    ) {
      return adminProfile;
    }

    return {
      ...adminProfile,

      fullName:
        snapshot.fullName ||
        adminProfile.fullName,

      role:
        snapshot.role ||
        adminProfile.role,

      profileImage:
        snapshot.profileImage ||
        adminProfile.profileImage,

      updatedAt:
        snapshot.updatedAt ||
        adminProfile.updatedAt,
    };
  }, [
    adminProfile,
    snapshot,
  ]);
};
