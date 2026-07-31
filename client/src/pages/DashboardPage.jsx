import useAuth from '../hooks/useAuth.js';
import AdminDashboard from './dashboards/AdminDashboard.jsx';
import SalesExecutiveDashboard from './dashboards/SalesExecutiveDashboard.jsx';
import InventoryManagerDashboard from './dashboards/InventoryManagerDashboard.jsx';
import TechnicianDashboard from './dashboards/TechnicianDashboard.jsx';
import CustomerDashboard from './dashboards/CustomerDashboard.jsx';

// Maps each backend role to its dashboard. Each role's component only calls
// the list endpoints that role is actually authorized for (see the RBAC
// matrix in the routes), so no dashboard ever triggers a 403.
const DASHBOARD_BY_ROLE = {
  Admin: AdminDashboard,
  'Sales Executive': SalesExecutiveDashboard,
  'Inventory Manager': InventoryManagerDashboard,
  Technician: TechnicianDashboard,
  Customer: CustomerDashboard
};

const DashboardPage = () => {
  const { user } = useAuth();
  const RoleDashboard = DASHBOARD_BY_ROLE[user.role];

  if (!RoleDashboard) {
    return <p className="text-gray-500">No dashboard is configured for your role yet.</p>;
  }

  return <RoleDashboard />;
};

export default DashboardPage;
