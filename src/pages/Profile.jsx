import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  Building2,
  Briefcase,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { profileService } from "../services/profileService";

const emptyForm = {
  fullName: "",
  companyName: "",
  designation: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const buildFormFromUser = (user) => ({
  fullName: user?.fullName || "",
  companyName: user?.companyName || "",
  designation: user?.designation || "",
  phone: user?.phone || "",
  email: user?.email || "",
  address: user?.address || "",
  city: user?.city || "",
  state: user?.state || "",
  pincode: user?.pincode || "",
});

const getProfileCompletion = (profile) => {
  const profileFields = [
    profile?.fullName,
    profile?.profilePhoto,
    profile?.companyName,
    profile?.designation,
    profile?.phone,
    profile?.email,
    profile?.address,
    profile?.city,
    profile?.state,
    profile?.pincode,
  ];

  const completedFields = profileFields.filter((value) => {
    if (typeof value === "string") {
      return Boolean(value.trim());
    }
    return Boolean(value);
  }).length;

  return {
    completedFields,
    totalFields: profileFields.length,
    percentage: Math.round((completedFields / profileFields.length) * 100),
  };
};

const ProfileDetail = ({ icon: Icon, label, value, fullWidth = false }) => (
  <div
    className={[
      "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4",
      fullWidth ? "sm:col-span-2" : "",
    ].join(" ")}
  >
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-950 sm:text-base">
        {value || "Not added"}
      </p>
    </div>
  </div>
);

const Profile = () => {
  const { user, isAuthLoading, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user && !isEditing) {
      setFormData(buildFormFromUser(user));
    }
  }, [user, isEditing]);

  const displayedPhoto = user?.profilePhoto || "";

  const completionProfile = isEditing
    ? {
        ...formData,
        profilePhoto: displayedPhoto,
      }
    : user;

  const completion = useMemo(
    () => getProfileCompletion(completionProfile),
    [completionProfile]
  );

  const userInitial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "C";

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;
    if (name === "pincode") {
      nextValue = value.replace(/\D/g, "");
    }
    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const startEditing = () => {
    setFormData(buildFormFromUser(user));
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData(buildFormFromUser(user));
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.pincode && formData.pincode.length !== 6) {
      setErrorMessage("Pincode must contain exactly 6 digits");
      return;
    }

    setIsSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value.trim());
      });
      
      await profileService.updateProfile(payload);
      await refreshUser();
      setSuccessMessage("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="p-6 sm:p-10 mx-auto max-w-5xl">
        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 sm:p-10 mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-r from-teal-800 to-emerald-600 px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative w-fit">
                  {displayedPhoto ? (
                    <img
                      src={displayedPhoto}
                      alt={user?.fullName || "Profile"}
                      className="h-24 w-24 rounded-3xl border-2 border-white/40 object-cover shadow-lg sm:h-28 sm:w-28"
                    />
                  ) : (
                    <span className="grid h-24 w-24 place-items-center rounded-3xl border border-white/30 bg-white/15 text-3xl font-bold shadow-lg backdrop-blur sm:h-28 sm:w-28">
                      {userInitial}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-100 sm:text-sm">
                    Client Profile
                  </p>
                  <h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
                    {formData.fullName || user?.fullName || "Client"}
                  </h1>
                  <p className="mt-2 text-sm text-teal-50">
                    Complete your profile for a seamless project management experience.
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 sm:w-fit"
                >
                  <Edit3 size={17} />
                  Edit profile
                </button>
              )}
            </div>

            <div className="relative mt-7 rounded-2xl bg-white/15 p-4 backdrop-blur sm:p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-teal-100 sm:text-sm">
                    Profile completion
                  </p>
                  <p className="mt-1 text-sm font-bold text-white sm:text-base">
                    {completion.completedFields} of {completion.totalFields} fields completed
                  </p>
                </div>
                <p className="text-2xl font-bold sm:text-3xl">
                  {completion.percentage}%
                </p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {errorMessage && (
              <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 sm:text-sm">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 sm:text-sm">
                <Check size={16} />
                {successMessage}
              </p>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                    Edit profile
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950 sm:text-2xl">
                    Personal and Business Information
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                    Add the missing information to complete your corporate profile.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Full Name
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      maxLength={60}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Company Name
                    </span>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Designation
                    </span>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Phone Number
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Email Address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Business Address
                    </span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      maxLength={250}
                      placeholder="Suite number, building, locality"
                      className="mt-1.5 w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      City
                    </span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      maxLength={80}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      State
                    </span>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      maxLength={80}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Pincode
                    </span>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      inputMode="numeric"
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />
                    {isSaving ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                    Profile information
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950 sm:text-2xl">
                    Personal and Business Details
                  </h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ProfileDetail
                    icon={UserRound}
                    label="Full Name"
                    value={user?.fullName}
                  />
                  <ProfileDetail
                    icon={Camera}
                    label="Profile Photo"
                    value={user?.profilePhoto ? "Photo added" : "Not added"}
                  />
                  <ProfileDetail
                    icon={Building2}
                    label="Company Name"
                    value={user?.companyName}
                  />
                  <ProfileDetail
                    icon={Briefcase}
                    label="Designation"
                    value={user?.designation}
                  />
                  <ProfileDetail
                    icon={Phone}
                    label="Phone Number"
                    value={user?.phone}
                  />
                  <ProfileDetail
                    icon={Mail}
                    label="Email Address"
                    value={user?.email}
                  />
                  <ProfileDetail
                    icon={MapPin}
                    label="Address"
                    value={user?.address}
                    fullWidth
                  />
                  <ProfileDetail
                    icon={MapPin}
                    label="City"
                    value={user?.city}
                  />
                  <ProfileDetail
                    icon={MapPin}
                    label="State"
                    value={user?.state}
                  />
                  <ProfileDetail
                    icon={MapPin}
                    label="Pincode"
                    value={user?.pincode}
                    fullWidth
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;