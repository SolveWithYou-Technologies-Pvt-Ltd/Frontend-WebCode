const formatValue = (
  value,
  fallback = "Not added"
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value;
};

const formatDate = (value) => {
  if (!value) {
    return "Not added";
  }

  return new Date(value).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatEnum = (value) => {
  if (!value) {
    return "Not added";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const DetailItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {formatValue(value)}
      </p>
    </div>
  );
};

const DetailSection = ({
  title,
  children,
}) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
};

const ProfileDetailsSections = ({
  user,
}) => {
  const address = [
    user?.address?.line1,
    user?.address?.line2,
    user?.address?.city,
    user?.address?.state,
    user?.address?.pincode,
    user?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-5">
      <DetailSection title="Personal Information">
        <DetailItem
          label="Full Name"
          value={user?.fullName}
        />
        <DetailItem
          label="Email Address"
          value={user?.email}
        />
        <DetailItem
          label="Mobile Number"
          value={user?.phone}
        />
        <DetailItem
          label="Alternate Mobile"
          value={user?.alternatePhone}
        />
        <DetailItem
          label="Date of Birth"
          value={formatDate(
            user?.dateOfBirth
          )}
        />
        <DetailItem
          label="Gender"
          value={formatEnum(
            user?.gender
          )}
        />
        <DetailItem
          label="Blood Group"
          value={user?.bloodGroup}
        />
      </DetailSection>

      <DetailSection title="Employment Information">
        <DetailItem
          label="Employee ID"
          value={user?.employeeCode}
        />
        <DetailItem
          label="Role"
          value={formatEnum(user?.role)}
        />
        <DetailItem
          label="Department"
          value={user?.department}
        />
        <DetailItem
          label="Designation"
          value={user?.designation}
        />
        <DetailItem
          label="Joining Date"
          value={formatDate(
            user?.joiningDate
          )}
        />
        <DetailItem
          label="Employment Type"
          value={formatEnum(
            user?.employmentType
          )}
        />
        <DetailItem
          label="Work Location"
          value={user?.workLocation}
        />
        <DetailItem
          label="Qualification"
          value={
            user?.highestQualification
          }
        />
        <DetailItem
          label="Experience"
          value={
            user?.totalExperienceYears ===
              null ||
            user?.totalExperienceYears ===
              undefined
              ? "Not added"
              : `${user.totalExperienceYears} year(s)`
          }
        />
        <DetailItem
          label="Reporting Manager"
          value={
            user?.reportingManager
              ?.fullName || "Top level"
          }
        />
        <DetailItem
          label="Status"
          value={
            user?.isDeleted
              ? "Deleted"
              : user?.isActive
                ? "Active"
                : "Inactive"
          }
        />
      </DetailSection>

      <DetailSection title="Address">
        <div className="sm:col-span-2 lg:col-span-3">
          <DetailItem
            label="Complete Address"
            value={address}
          />
        </div>
      </DetailSection>

      <DetailSection title="Emergency Contact">
        <DetailItem
          label="Contact Name"
          value={
            user?.emergencyContact?.name
          }
        />
        <DetailItem
          label="Relation"
          value={
            user?.emergencyContact
              ?.relation
          }
        />
        <DetailItem
          label="Mobile Number"
          value={
            user?.emergencyContact?.phone
          }
        />
      </DetailSection>
    </div>
  );
};

export default ProfileDetailsSections;
