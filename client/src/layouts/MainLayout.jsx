import { Outlet, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            DriveSync
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Vehicles</Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                {(user.role === 'Admin' || user.role === 'Sales Executive') && (
                  <>
                    <Link to="/customers" className="hover:text-gray-900">Customers</Link>
                    <Link to="/sales" className="hover:text-gray-900">Sales</Link>
                  </>
                )}
                {user.role === 'Admin' && (
                  <Link to="/admin" className="hover:text-gray-900">Admin</Link>
                )}
                <Link to="/account" className="hover:text-gray-900">My Account</Link>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {user.role}
                </span>
                <button type="button" onClick={logout} className="hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-900">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        DriveSync — Automobile Sales &amp; Service Management
      </footer>
    </div>
  );
};

export default MainLayout;
