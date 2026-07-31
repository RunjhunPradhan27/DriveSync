import { Navigate, Outlet, useLocation } from 'react-router-dom';
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
      <div className="rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 text-sm">
        You do not have permission to view this page.
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
