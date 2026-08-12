const actionLabels = {
  created:
    "Account created",

  details_updated:
    "Account details edited",

  profile_updated:
    "Profile updated",

  reporting_updated:
    "Reporting manager changed",

  reporting_reassigned:
    "Reporting manager reassigned",

  permissions_updated:
    "Permissions changed",

  role_updated:
    "Role changed",

  activated:
    "Account activated",

  deactivated:
    "Account deactivated",

  deleted:
    "Account deleted",
};

export const getActorId = (
  actor
) => {
  if (!actor) {
    return "";
  }

  if (
    typeof actor ===
    "string"
  ) {
    return actor;
  }

  return String(
    actor._id ||
    actor.id ||
    ""
  );
};

export const formatActorName = (
  actor
) => {
  if (!actor) {
    return "System";
  }

  /*
    Always show the real actor name.

    Earlier the currently logged-in actor was
    displayed as "Self". This was confusing when
    an Admin/Superadmin edited another user's
    profile.
  */
  if (
    typeof actor ===
    "string"
  ) {
    return "User";
  }

  const actorName =
    actor.fullName?.trim() ||
    actor.email?.trim() ||
    "User";

  const roleText =
    actor.role
      ? ` (${actor.role})`
      : "";

  return `${actorName}${roleText}`;
};

export const formatActivityAction = (
  action
) => {
  return (
    actionLabels[action] ||
    String(
      action ||
      "Updated"
    )
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  );
};

export const formatAuditDate = (
  date
) => {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return parsedDate
    .toLocaleString();
};
