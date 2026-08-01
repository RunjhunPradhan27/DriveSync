import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

/**
 * Guards nested routes behind authentication, and optionally behind a role
 * whitelist. Unauthenticated users are redirected to /login (preserving the
 * original destination so they land back here after logging in);
 * authenticated users with a disallowed role see a "not authorized" message
 * instead of the protected content.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
        <span>You do not have permission to view this page.</span>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
