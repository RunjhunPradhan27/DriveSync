import { LayoutDashboard, Car } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import QuickActionCard from '../../components/ui/QuickActionCard.jsx';

// Customers currently have no protected list endpoint of their own (see the
// RBAC matrix) — only the public vehicle catalog is available to them here.
// Recent Activity is an honest placeholder rather than invented data.
const CustomerDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);

  return (
    <div>
      <PageHeader icon={LayoutDashboard} title="My Dashboard" description="Welcome back — here's what's available to you" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard icon={Car} accent="indigo" label="Vehicles Available" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickActionCard to="/" icon={Car} title="Browse Vehicles" description="Explore the current dealership inventory" />
      </div>

      <RecentActivityList
        title="Recent Activity"
        items={[]}
        loading={false}
        error={null}
        emptyMessage="No recent activity available for your account yet."
        renderItem={() => null}
      />
    </div>
  );
};

export default CustomerDashboard;
