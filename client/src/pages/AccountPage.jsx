import useAuth from '../hooks/useAuth.js';

const AccountPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Account</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-2 text-sm">
        <p>
          <span className="text-gray-500">User ID:</span>{' '}
          <span className="font-medium text-gray-900">{user.id}</span>
        </p>
        <p>
          <span className="text-gray-500">Role:</span>{' '}
          <span className="font-medium text-gray-900">{user.role}</span>
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-500">The full dashboard for your role is coming soon.</p>

      <button
        onClick={logout}
        className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Log Out
      </button>
    </div>
  );
};

export default AccountPage;
