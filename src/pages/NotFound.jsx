import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-screen items-center justify-center px-6 text-center bg-slate-50">
      <div className="max-w-lg">

        <p className="text-8xl sm:text-9xl font-extrabold text-teal-600 tracking-tight">
          404
        </p>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Oops! Page Not Found
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          &larr; Go Back
        </button>
      </div>
    </section>
  );
};

export default NotFound;