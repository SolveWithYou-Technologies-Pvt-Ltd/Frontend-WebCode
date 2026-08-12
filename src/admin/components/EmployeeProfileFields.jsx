const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500";

const SectionHeading = ({
  title,
  description,
}) => {
  return (
    <div className="sm:col-span-2">
      <h2 className="text-base font-bold text-slate-900">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
};

const EmployeeProfileFields = ({
  formData,
  onChange,
  onNestedChange,
  employmentReadOnly = false,
}) => {
  return (
    <div className="space-y-7">
      <section className="grid gap-4 sm:grid-cols-2">
        <SectionHeading
          title="Personal Information"
          description="Basic contact and personal details."
        />

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Full Name *
          </span>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) =>
              onChange(
                "fullName",
                event.target.value
              )
            }
            required
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Email Address *
          </span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              onChange(
                "email",
                event.target.value
              )
            }
            required
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Mobile Number
          </span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(event) =>
              onChange(
                "phone",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Alternate Mobile
          </span>
          <input
            type="tel"
            value={
              formData.alternatePhone
            }
            onChange={(event) =>
              onChange(
                "alternatePhone",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Date of Birth
          </span>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(event) =>
              onChange(
                "dateOfBirth",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Gender
          </span>
          <select
            value={formData.gender}
            onChange={(event) =>
              onChange(
                "gender",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Select gender
            </option>
            <option value="male">
              Male
            </option>
            <option value="female">
              Female
            </option>
            <option value="other">
              Other
            </option>
            <option value="prefer_not_to_say">
              Prefer not to say
            </option>
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Blood Group
          </span>
          <select
            value={formData.bloodGroup}
            onChange={(event) =>
              onChange(
                "bloodGroup",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Select blood group
            </option>
            {[
              "A+",
              "A-",
              "B+",
              "B-",
              "AB+",
              "AB-",
              "O+",
              "O-",
            ].map((bloodGroup) => (
              <option
                key={bloodGroup}
                value={bloodGroup}
              >
                {bloodGroup}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <SectionHeading
          title="Employment Information"
          description="Job and organization details."
        />

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Employee ID / Staff Code
          </span>
          <input
            type="text"
            value={formData.employeeCode}
            disabled
            readOnly
            placeholder="Generated automatically"
            className={inputClass}
          />

          <p className="mt-1 text-[11px] text-slate-500">
            Employee ID cannot be edited.
          </p>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Department
          </span>
          <input
            type="text"
            value={formData.department}
            disabled={employmentReadOnly}
            onChange={(event) =>
              onChange(
                "department",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Designation
          </span>
          <input
            type="text"
            value={formData.designation}
            disabled={employmentReadOnly}
            onChange={(event) =>
              onChange(
                "designation",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Joining Date
          </span>
          <input
            type="date"
            value={formData.joiningDate}
            disabled={employmentReadOnly}
            onChange={(event) =>
              onChange(
                "joiningDate",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Employment Type
          </span>
          <select
            value={
              formData.employmentType
            }
            disabled={employmentReadOnly}
            onChange={(event) =>
              onChange(
                "employmentType",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Select type
            </option>
            <option value="full_time">
              Full Time
            </option>
            <option value="part_time">
              Part Time
            </option>
            <option value="contract">
              Contract
            </option>
            <option value="intern">
              Intern
            </option>
            <option value="temporary">
              Temporary
            </option>
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Work Location
          </span>
          <input
            type="text"
            value={
              formData.workLocation
            }
            disabled={employmentReadOnly}
            onChange={(event) =>
              onChange(
                "workLocation",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Highest Qualification
          </span>
          <input
            type="text"
            value={
              formData.highestQualification
            }
            onChange={(event) =>
              onChange(
                "highestQualification",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Total Experience (Years)
          </span>
          <input
            type="number"
            min="0"
            max="60"
            step="0.5"
            value={
              formData.totalExperienceYears
            }
            onChange={(event) =>
              onChange(
                "totalExperienceYears",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>
      </section>

      <section className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <SectionHeading
          title="Address"
          description="Current residential address."
        />

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Address Line 1
          </span>
          <input
            type="text"
            value={
              formData.address.line1
            }
            onChange={(event) =>
              onNestedChange(
                "address",
                "line1",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Address Line 2
          </span>
          <input
            type="text"
            value={
              formData.address.line2
            }
            onChange={(event) =>
              onNestedChange(
                "address",
                "line2",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            City
          </span>
          <input
            type="text"
            value={formData.address.city}
            onChange={(event) =>
              onNestedChange(
                "address",
                "city",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            State
          </span>
          <input
            type="text"
            value={
              formData.address.state
            }
            onChange={(event) =>
              onNestedChange(
                "address",
                "state",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Pincode
          </span>
          <input
            type="text"
            value={
              formData.address.pincode
            }
            onChange={(event) =>
              onNestedChange(
                "address",
                "pincode",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Country
          </span>
          <input
            type="text"
            value={
              formData.address.country
            }
            onChange={(event) =>
              onNestedChange(
                "address",
                "country",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>
      </section>

      <section className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <SectionHeading
          title="Emergency Contact"
          description="Contact person for an emergency."
        />

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Contact Name
          </span>
          <input
            type="text"
            value={
              formData.emergencyContact
                .name
            }
            onChange={(event) =>
              onNestedChange(
                "emergencyContact",
                "name",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Relation
          </span>
          <input
            type="text"
            value={
              formData.emergencyContact
                .relation
            }
            onChange={(event) =>
              onNestedChange(
                "emergencyContact",
                "relation",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Emergency Mobile
          </span>
          <input
            type="tel"
            value={
              formData.emergencyContact
                .phone
            }
            onChange={(event) =>
              onNestedChange(
                "emergencyContact",
                "phone",
                event.target.value
              )
            }
            className={inputClass}
          />
        </label>
      </section>
    </div>
  );
};

export default EmployeeProfileFields;
