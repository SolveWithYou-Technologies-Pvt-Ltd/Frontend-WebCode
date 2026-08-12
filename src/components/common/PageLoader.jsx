const PageLoader = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-100 border-t-teal-600" />
        Checking your account...
      </div>
    </div>
  );
};

export default PageLoader;
