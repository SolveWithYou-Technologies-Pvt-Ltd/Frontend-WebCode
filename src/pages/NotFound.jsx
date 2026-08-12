import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <p className="text-5xl font-bold text-teal-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Page not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
