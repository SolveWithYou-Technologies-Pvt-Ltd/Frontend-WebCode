const formatDateForInput = (
  value
) => {
  if (!value) {
    return "";
  }

  return new Date(value)
    .toISOString()
    .slice(0, 10);
};

export const createEmptyEmployeeProfile = () => {
  return {
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    employeeCode: "",
    department: "",
    designation: "",
    joiningDate: "",
    employmentType: "",
    workLocation: "",
    highestQualification: "",
    totalExperienceYears: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
  };
};

export const mapUserToEmployeeProfile = (
  user = {}
) => {
  return {
    ...createEmptyEmployeeProfile(),
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    alternatePhone:
      user.alternatePhone || "",
    dateOfBirth:
      formatDateForInput(
        user.dateOfBirth
      ),
    gender: user.gender || "",
    bloodGroup:
      user.bloodGroup || "",
    employeeCode:
      user.employeeCode || "",
    department:
      user.department || "",
    designation:
      user.designation || "",
    joiningDate:
      formatDateForInput(
        user.joiningDate
      ),
    employmentType:
      user.employmentType || "",
    workLocation:
      user.workLocation || "",
    highestQualification:
      user.highestQualification || "",
    totalExperienceYears:
      user.totalExperienceYears ?? "",
    address: {
      line1:
        user.address?.line1 || "",
      line2:
        user.address?.line2 || "",
      city:
        user.address?.city || "",
      state:
        user.address?.state || "",
      pincode:
        user.address?.pincode || "",
      country:
        user.address?.country ||
        "India",
    },
    emergencyContact: {
      name:
        user.emergencyContact?.name ||
        "",
      relation:
        user.emergencyContact
          ?.relation || "",
      phone:
        user.emergencyContact?.phone ||
        "",
    },
  };
};
