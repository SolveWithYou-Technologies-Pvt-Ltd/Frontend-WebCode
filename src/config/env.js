const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!VITE_API_BASE_URL) {
  throw new Error("VITE_VITE_API_BASE_URL is not defined");
}

export { VITE_API_BASE_URL };
