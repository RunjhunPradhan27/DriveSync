import { UserCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const AccountPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md">
      <PageHeader icon={UserCircle} title="My Account" />

      <Card>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">User ID</span>
            <span className="font-medium text-slate-900">{user.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Role</span>
            <span className="font-medium text-slate-900">{user.role}</span>
          </div>
        </div>
      </Card>

      <p className="mt-4 text-sm text-slate-500">The full dashboard for your role is coming soon.</p>

      <Button variant="secondary" onClick={logout} className="mt-4">
        Log Out
      </Button>
    </div>
  );
};

export default AccountPage;
