import { useLocation } from "react-router-dom";

const PermissionPlaceholderPage = () => {
  const location = useLocation();

  const moduleName =
    location.pathname.split("/").filter(Boolean).pop() || "module";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold capitalize text-slate-900">
        {moduleName}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Connect this page to the matching backend module routes.
      </p>
    </div>
  );
};

export default PermissionPlaceholderPage;
