import {
  useEffect,
  useState,
} from "react";


const getFirstLetter = (
  fullName = ""
) => {
  const cleanName =
    String(fullName).trim();

  return (
    cleanName
      .charAt(0)
      .toUpperCase() ||
    "D"
  );
};

const AdminDoctorAvatar = ({
  doctor,
  className = "h-9 w-9",
}) => {
  const imageUrl ="lsklskls"

  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const showImage =
    Boolean(imageUrl) &&
    !imageFailed;

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt={
          doctor?.fullName ||
          "Doctor"
        }
        loading="lazy"
        onError={() =>
          setImageFailed(true)
        }
        className={`${className} shrink-0 rounded-full border border-slate-200 object-cover`}
      />
    );
  }

  return (
    <div
      title={
        doctor?.fullName ||
        "Doctor"
      }
      className={`${className} grid shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700`}
    >
      {getFirstLetter(
        doctor?.fullName
      )}
    </div>
  );
};

export default AdminDoctorAvatar;
