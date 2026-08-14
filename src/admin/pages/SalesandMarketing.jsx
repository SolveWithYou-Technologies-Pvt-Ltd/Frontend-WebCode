import React from 'react'
import useAdminAuth from "../hooks/useAdminAuth";

const ClientQoutes = () => {
    const { hasPermission } = useAdminAuth();
      const canAdd = useMemo(() => 
        hasPermission("clients", "create"), 
      [hasPermission]);
      
      const canEdit = useMemo(() => 
        hasPermission("clients", "edit"), 
      [hasPermission]);
      
      const canDelete = useMemo(() => 
        hasPermission("clients", "delete"), 
      [hasPermission]);
  return (
    <div>
      ServicesManage
    </div>
  )
}

export default ClientQoutes
