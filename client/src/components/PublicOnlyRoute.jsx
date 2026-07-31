import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Guards routes meant only for unauthenticated visitors (e.g. /login).
 * Already-authenticated users are redirected away — back to wherever they
 * originally came from, if known, otherwise the home page.
 */
const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
