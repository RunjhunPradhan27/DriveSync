import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllInventory } from '../../services/inventory.service.js';
import { getAllSpareParts } from '../../services/spareParts.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';

const InventoryManagerDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const inventory = useFetch(getAllInventory, []);
  const spareParts = useFetch(getAllSpareParts, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard label="Inventory Records" value={inventory.data?.length} loading={inventory.loading} error={inventory.error} />
        <DashboardCard label="Spare Parts" value={spareParts.data?.length} loading={spareParts.loading} error={spareParts.error} />
      </div>

      <RecentActivityList
        title="Recently Updated Inventory"
        items={inventory.data?.slice(0, 5)}
        loading={inventory.loading}
        error={inventory.error}
        emptyMessage="No inventory records yet."
        renderItem={(record) => (
          <div className="flex items-center justify-between">
            <span>Vehicle #{record.vehicle_id} &middot; {record.storage_location}</span>
            <span className="font-medium text-gray-900">{record.quantity} units &middot; {record.stock_status}</span>
          </div>
        )}
      />
    </div>
  );
};

export default InventoryManagerDashboard;
