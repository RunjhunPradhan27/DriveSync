import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';

// Customers currently have no protected list endpoint of their own (see the
// RBAC matrix) — only the public vehicle catalog is available to them here.
// Recent Activity is an honest placeholder rather than invented data.
const CustomerDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          label="Vehicles Available"
          value={vehicles.data?.length}
          loading={vehicles.loading}
          error={vehicles.error}
        />
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
