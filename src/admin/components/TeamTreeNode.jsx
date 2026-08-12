import {
  useEffect,
  useMemo,
  useState,
} from "react";

import adminApi from "../api/adminApi";

const getInitials = (fullName = "") => {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
};

const getServerOrigin = () => {
  const apiBaseUrl =
    adminApi?.defaults?.baseURL || "/";

  try {
    return new URL(
      apiBaseUrl,
      window.location.origin
    ).origin;
  } catch {
    return window.location.origin;
  }
};

const getProfileImageUrl = (user) => {
  const imagePath =
    user?.profileImage ||
    user?.profilePicture ||
    user?.avatar ||
    user?.image ||
    "";

  if (!imagePath) return "";

  const cleanPath = String(imagePath)
    .trim()
    .replace(/\\/g, "/");

  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://") ||
    cleanPath.startsWith("data:") ||
    cleanPath.startsWith("blob:")
  ) {
    return cleanPath;
  }

  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath
    : `/${cleanPath}`;

  return `${getServerOrigin()}${normalizedPath}`;
};

const TeamAvatar = ({ user }) => {
  const imageUrl = useMemo(
    () => getProfileImageUrl(user),
    [user]
  );

  const [imageFailed, setImageFailed] =
    useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const showImage = imageUrl && !imageFailed;

  return (
    <div className="mx-auto flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-100 text-[10px] font-bold text-blue-700 shadow-sm ring-2 ring-blue-100 sm:h-12 sm:w-12 sm:text-xs">
      {showImage ? (
        <img
          src={imageUrl}
          alt={`${user?.fullName || "Team member"} profile`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{getInitials(user?.fullName)}</span>
      )}
    </div>
  );
};

const TeamTreeNode = ({
  node,
  depth = 0,
}) => {
  const children = Array.isArray(node.children)
    ? node.children
    : [];

  const hasChildren = children.length > 0;

  const department =
    node.department?.trim() ||
    "Department not added";

  const designation =
    node.designation?.trim() ||
    "Designation not added";

  const topSpacing = depth === 0 ? "pt-1" : "pt-4";

  return (
    <li
      className={`
        relative px-1.5 text-center ${topSpacing}
        before:absolute before:right-1/2 before:top-0 before:h-px before:w-1/2 before:bg-slate-300 before:content-['']
        after:absolute after:left-1/2 after:top-0 after:h-px after:w-1/2 after:bg-slate-300 after:content-['']
        first:before:hidden last:after:hidden
        only:before:hidden only:after:hidden
      `}
    >
      {depth > 0 && (
        <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-slate-300" />
      )}

      <div className="group relative z-10 mx-auto w-32 px-1 py-1 sm:w-36">
        <TeamAvatar user={node} />

        <p className="mt-1.5 break-words text-[10px] font-bold leading-4 text-slate-900 transition group-hover:text-blue-700 sm:text-[11px]">
          {node.fullName || "Unnamed user"}
        </p>

        <p className="mt-0.5 break-words text-[8px] font-semibold leading-3 text-slate-700 sm:text-[9px]">
          {department}
        </p>

        <p className="break-words text-[8px] leading-3 text-slate-500 sm:text-[9px]">
          ({designation})
        </p>

        {node.phone && (
          <a
            href={`tel:${node.phone}`}
            className="mt-0.5 block break-words text-[8px] font-medium leading-3 text-slate-500 transition hover:text-blue-700 hover:underline sm:text-[9px]"
          >
            {node.phone}
          </a>
        )}
      </div>

      {hasChildren && (
        <>
          <div className="mx-auto h-4 w-px bg-slate-300" />

          <ul className="relative flex min-w-max items-start justify-center">
            {children.map((childNode) => (
              <TeamTreeNode
                key={
                  childNode._id ||
                  childNode.employeeCode ||
                  childNode.email
                }
                node={childNode}
                depth={depth + 1}
              />
            ))}
          </ul>
        </>
      )}
    </li>
  );
};

export default TeamTreeNode;
