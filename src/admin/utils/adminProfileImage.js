import adminApi from "../api/adminApi";

const removeTrailingSlash = (
  value
) => {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
};

const getOriginFromUrl = (
  value
) => {
  const cleanValue =
    removeTrailingSlash(value);

  if (!cleanValue) {
    return "";
  }

  try {
    /*
      Absolute API URLs such as:
      http://localhost:8000/api/admin
    */
    if (
      /^https?:\/\//i.test(
        cleanValue
      )
    ) {
      return new URL(
        cleanValue
      ).origin;
    }

    /*
      Relative API URLs work when Vite/NGINX proxies
      the backend through the same domain.
    */
    if (
      typeof window !==
      "undefined"
    ) {
      return new URL(
        cleanValue,
        window.location.origin
      ).origin;
    }
  } catch {
    return "";
  }

  return "";
};

export const getAdminBackendOrigin =
  () => {
    const candidates = [
      import.meta.env
        .VITE_BACKEND_URL,

      import.meta.env
        .VITE_API_URL,

      adminApi.defaults
        ?.baseURL,
    ];

    for (
      const candidate of candidates
    ) {
      const origin =
        getOriginFromUrl(
          candidate
        );

      if (origin) {
        return origin;
      }
    }

    if (
      typeof window !==
      "undefined"
    ) {
      return window.location.origin;
    }

    return "";
  };

const addVersionQuery = (
  imageUrl,
  version
) => {
  if (
    !imageUrl ||
    !version ||
    /^(data:|blob:)/i.test(
      imageUrl
    )
  ) {
    return imageUrl;
  }

  const separator =
    imageUrl.includes("?")
      ? "&"
      : "?";

  return `${imageUrl}${separator}v=${encodeURIComponent(
    String(version)
  )}`;
};

export const getAdminProfileImageUrl = (
  imagePath,
  version = ""
) => {
  const cleanPath =
    String(imagePath || "").trim();

  if (!cleanPath) {
    return "";
  }

  if (
    /^(data:|blob:)/i.test(
      cleanPath
    )
  ) {
    return cleanPath;
  }

  if (
    /^https?:\/\//i.test(
      cleanPath
    )
  ) {
    return addVersionQuery(
      cleanPath,
      version
    );
  }

  const backendOrigin =
    getAdminBackendOrigin();

  const normalizedPath =
    cleanPath.startsWith("/")
      ? cleanPath
      : `/${cleanPath}`;

  const imageUrl =
    backendOrigin
      ? `${backendOrigin}${normalizedPath}`
      : normalizedPath;

  return addVersionQuery(
    imageUrl,
    version
  );
};
