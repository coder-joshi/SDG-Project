import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentRole, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8F7]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Authenticating Green Registry...</span>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(currentRole)) {
    // Redirect to home for this role
    if (currentRole === 'verifier') {
      return <Navigate to="/verifier/queue" replace />;
    }
    if (currentRole === 'corporate') {
      return <Navigate to="/marketplace" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
