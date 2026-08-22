import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Array<'student' | 'teacher' | 'moderator' | 'admin'>;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { activeMode, currentUser } = useApp();
  const location = useLocation();

  const isAuthenticated = currentUser && currentUser.id !== 'usr-guest' && activeMode !== 'marketing' && Boolean(currentUser.email);

  // If user is guest or not authenticated, redirect to public home with return state
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const effectiveRole = (currentUser.role || activeMode) as Role;

  // Check if role is authorized
  if (!allowedRoles.includes(effectiveRole)) {
    // If not authorized, bounce them to their authorized role workspace
    if (effectiveRole === 'teacher') {
      return <Navigate to="/teacher/courses" replace />;
    }
    if (effectiveRole === 'admin') {
      return <Navigate to="/admin/vitals" replace />;
    }
    if (effectiveRole === 'moderator') {
      return <Navigate to="/moderator/roadmaps" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};
