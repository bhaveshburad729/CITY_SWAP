import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const savedUser = localStorage.getItem('ecopulse_user');

  let user = null;
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      user = null;
    }
  }

  // 1. Unauthenticated Security Check: Redirect unauthenticated requests to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-Based Access Control (RBAC) Security Check:
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || 'citizen').toLowerCase();
    const hasPermission = allowedRoles.some((r) => r.toLowerCase() === userRole);

    if (!hasPermission) {
      // Security enforcement: redirect unauthorized roles to their authorized home
      if (userRole === 'driver') {
        return <Navigate to="/driver" replace />;
      } else if (userRole === 'admin' || userRole === 'collector') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/citizen" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
