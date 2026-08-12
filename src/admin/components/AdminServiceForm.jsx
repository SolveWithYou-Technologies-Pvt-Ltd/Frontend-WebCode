import {
  useEffect,
  useState,
} from "react";

const CONSULTATION_MODES = [
  "Clinic",
  "Video",
  "Home Sample",
];

const ICON_OPTIONS = [
  "Stethoscope",
  "Video",
  "Building2",
  "HeartPulse",
  "Activity",
  "Syringe",
  "Microscope",
  "TestTube2",
  "ShieldCheck",
  "CalendarCheck",
];

export const getEmptyServiceForm =
  () => {
    return {
      serviceCode: "",
      title: "",
      category: "",
      duration: "",
      startingPrice: "",
      iconKey: "Stethoscope",
      shortDescription: "",
      fullDescription: "",
      consultationMode: [
        "Clinic",
      ],
      features: [
        "",
      ],
      isPopular: false,
      isActive: true,
    };
  };

const normalizeValues = (
  values
) => {
  const emptyForm =
    getEmptyServiceForm();

  return {
    ...emptyForm,
    ...(values || {}),

    startingPrice:
      values?.startingPrice ??
      "",

    consultationMode:
      Array.isArray(
        values?.consultationMode
      ) &&
      values.consultationMode
        .length > 0
        ? values.consultationMode
        : emptyForm
            .consultationMode,

    features:
      Array.isArray(
        values?.features
      ) &&
      values.features.length > 0
        ? values.features
        : [
            "",
          ],
  };
};

const AdminServiceForm = ({
  initialValues,
  submitting,
  submitLabel,
  error,
  onSubmit,
  onCancel,
}) => {
  const [
    formData,
    setFormData,
  ] = useState(() =>
    normalizeValues(
      initialValues
    )
  );

  const [
    localError,
    setLocalError,
  ] = useState("");

  useEffect(() => {
    setFormData(
      normalizeValues(
        initialValues
      )
    );
  }, [initialValues]);

  const updateField = (
    fieldName,
    value
  ) => {
    setFormData(
      (currentData) => ({
        ...currentData,
        [fieldName]: value,
      })
    );
  };

  const toggleMode = (
    mode
  ) => {
    setFormData(
      (currentData) => {
        const alreadySelected =
          currentData
            .consultationMode
            .includes(mode);

        return {
          ...currentData,

          consultationMode:
            alreadySelected
              ? currentData
                  .consultationMode
                  .filter(
                    (item) =>
                      item !== mode
                  )
              : [
                  ...currentData
                    .consultationMode,
                  mode,
                ],
        };
      }
    );
  };

  const updateFeature = (
    index,
    value
  ) => {
    setFormData(
      (currentData) => ({
        ...currentData,

        features:
          currentData.features.map(
            (
              feature,
              featureIndex
            ) =>
              featureIndex === index
                ? value
                : feature
          ),
      })
    );
  };

  const addFeature = () => {
    setFormData(
      (currentData) => ({
        ...currentData,

        features: [
          ...currentData.features,
          "",
        ],
      })
    );
  };

  const removeFeature = (
    index
  ) => {
    setFormData(
      (currentData) => {
        const nextFeatures =
          currentData.features.filter(
            (
              feature,
              featureIndex
            ) =>
              featureIndex !== index
          );

        return {
          ...currentData,

          features:
            nextFeatures.length > 0
              ? nextFeatures
              : [
                  "",
                ],
        };
      }
    );
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();
    setLocalError("");

    if (
      formData
        .consultationMode
        .length === 0
    ) {
      setLocalError(
        "Select at least one consultation mode"
      );

      return;
    }

    const price =
      Number(
        formData.startingPrice
      );

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setLocalError(
        "Enter a valid starting price"
      );

      return;
    }

    onSubmit({
      title:
        formData.title.trim(),

      category:
        formData.category.trim(),

      duration:
        formData.duration.trim(),

      startingPrice: price,

      iconKey:
        formData.iconKey.trim(),

      shortDescription:
        formData
          .shortDescription
          .trim(),

      fullDescription:
        formData
          .fullDescription
          .trim(),

      consultationMode:
        formData
          .consultationMode,

      features:
        formData.features
          .map((feature) =>
            feature.trim()
          )
          .filter(Boolean),

      isPopular:
        formData.isPopular,

      isActive:
        formData.isActive,
    });
  };

  const inputClass =
    "w-full rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-blue-500 sm:text-xs";

  const labelClass =
    "mb-1 block text-[10px] font-semibold text-slate-600 sm:text-xs";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-5"
    >
      {(error ||
        localError) && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-700 sm:text-xs">
          {error ||
            localError}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {formData.serviceCode && (
          <label>
            <span
              className={
                labelClass
              }
            >
              Service Code
            </span>

            <input
              value={
                formData.serviceCode
              }
              disabled
              className={`${inputClass} bg-slate-100 text-slate-500`}
            />
          </label>
        )}

        <label
          className={
            formData.serviceCode
              ? ""
              : "sm:col-span-2"
          }
        >
          <span
            className={
              labelClass
            }
          >
            Service Title
          </span>

          <input
            required
            maxLength={120}
            value={formData.title}
            onChange={(event) =>
              updateField(
                "title",
                event.target.value
              )
            }
            placeholder="General Physician Consultation"
            className={inputClass}
          />
        </label>

        <label>
          <span
            className={
              labelClass
            }
          >
            Category
          </span>

          <input
            required
            value={
              formData.category
            }
            onChange={(event) =>
              updateField(
                "category",
                event.target.value
              )
            }
            placeholder="Consultation"
            className={inputClass}
          />
        </label>

        <label>
          <span
            className={
              labelClass
            }
          >
            Duration
          </span>

          <input
            required
            value={
              formData.duration
            }
            onChange={(event) =>
              updateField(
                "duration",
                event.target.value
              )
            }
            placeholder="20 minutes"
            className={inputClass}
          />
        </label>

        <label>
          <span
            className={
              labelClass
            }
          >
            Starting Price
          </span>

          <input
            required
            type="number"
            min="0"
            step="1"
            value={
              formData.startingPrice
            }
            onChange={(event) =>
              updateField(
                "startingPrice",
                event.target.value
              )
            }
            placeholder="399"
            className={inputClass}
          />
        </label>

        <label>
          <span
            className={
              labelClass
            }
          >
            Icon Key
          </span>

          <input
            required
            list="admin-service-icons"
            value={
              formData.iconKey
            }
            onChange={(event) =>
              updateField(
                "iconKey",
                event.target.value
              )
            }
            className={inputClass}
          />

          <datalist id="admin-service-icons">
            {ICON_OPTIONS.map(
              (iconKey) => (
                <option
                  key={iconKey}
                  value={iconKey}
                />
              )
            )}
          </datalist>
        </label>
      </div>

      <div>
        <p className={labelClass}>
          Consultation Mode
        </p>

        <div className="flex flex-wrap gap-2">
          {CONSULTATION_MODES.map(
            (mode) => (
              <label
                key={mode}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-2 text-[10px] font-medium text-slate-700 sm:text-xs"
              >
                <input
                  type="checkbox"
                  checked={formData.consultationMode.includes(
                    mode
                  )}
                  onChange={() =>
                    toggleMode(mode)
                  }
                />

                {mode}
              </label>
            )
          )}
        </div>
      </div>

      <label>
        <span className={labelClass}>
          Short Description
        </span>

        <textarea
          required
          rows={3}
          maxLength={350}
          value={
            formData.shortDescription
          }
          onChange={(event) =>
            updateField(
              "shortDescription",
              event.target.value
            )
          }
          className={inputClass}
        />
      </label>

      <label>
        <span className={labelClass}>
          Full Description
        </span>

        <textarea
          required
          rows={5}
          maxLength={1500}
          value={
            formData.fullDescription
          }
          onChange={(event) =>
            updateField(
              "fullDescription",
              event.target.value
            )
          }
          className={inputClass}
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className={labelClass}>
            Features
          </p>

          <button
            type="button"
            onClick={addFeature}
            className="rounded-md border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-700 sm:text-xs"
          >
            Add Feature
          </button>
        </div>

        <div className="space-y-2">
          {formData.features.map(
            (
              feature,
              index
            ) => (
              <div
                key={`service-feature-${index}`}
                className="flex gap-2"
              >
                <input
                  value={feature}
                  onChange={(event) =>
                    updateFeature(
                      index,
                      event.target.value
                    )
                  }
                  placeholder={`Feature ${
                    index + 1
                  }`}
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() =>
                    removeFeature(
                      index
                    )
                  }
                  className="rounded-md border border-red-200 px-2 text-[10px] font-semibold text-red-600 sm:text-xs"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2 text-[10px] font-medium text-slate-700 sm:text-xs">
          <input
            type="checkbox"
            checked={
              formData.isPopular
            }
            onChange={(event) =>
              updateField(
                "isPopular",
                event.target.checked
              )
            }
          />

          Popular Service
        </label>

        <label className="flex items-center gap-2 text-[10px] font-medium text-slate-700 sm:text-xs">
          <input
            type="checkbox"
            checked={
              formData.isActive
            }
            onChange={(event) =>
              updateField(
                "isActive",
                event.target.checked
              )
            }
          />

          Active Service
        </label>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700 sm:text-xs"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-50 sm:text-xs"
        >
          {submitting
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AdminServiceForm;
