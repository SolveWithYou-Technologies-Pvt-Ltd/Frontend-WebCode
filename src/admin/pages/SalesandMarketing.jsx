import React, { useMemo } from 'react';
import { Target, Clock } from 'lucide-react';
import useAdminAuth from "../hooks/useAdminAuth";

const SalesandMarketing = () => {
  const { hasPermission } = useAdminAuth();
  const canAdd = useMemo(() => hasPermission("clients", "create"), [hasPermission]);
  const canEdit = useMemo(() => hasPermission("clients", "edit"), [hasPermission]);
  const canDelete = useMemo(() => hasPermission("clients", "delete"), [hasPermission]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4 border border-teal-100 shadow-sm">
        <Target size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Sales & Marketing</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        This feature is in development phase and will be coming soon.
      </p>
      <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
        <Clock size={12} /> Coming Soon
      </div>
    </div>
  );
};

export default SalesandMarketing;