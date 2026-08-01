import { LayoutDashboard, Car, Boxes, Package, PackagePlus } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllInventory } from '../../services/inventory.service.js';
import { getAllSpareParts } from '../../services/spareParts.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import QuickActionCard from '../../components/ui/QuickActionCard.jsx';

const InventoryManagerDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const inventory = useFetch(getAllInventory, []);
  const spareParts = useFetch(getAllSpareParts, []);

  return (
    <div>
      <PageHeader icon={LayoutDashboard} title="Inventory Dashboard" description="Stock levels across vehicles and spare parts" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard icon={Car} accent="indigo" label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard icon={Boxes} accent="amber" label="Inventory Records" value={inventory.data?.length} loading={inventory.loading} error={inventory.error} />
        <DashboardCard icon={Package} accent="amber" label="Spare Parts" value={spareParts.data?.length} loading={spareParts.loading} error={spareParts.error} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickActionCard to="/inventory/new" icon={Boxes} title="Add Stock Record" description="Log new vehicle stock" />
        <QuickActionCard to="/spare-parts/new" icon={PackagePlus} title="Add Spare Part" description="Add a new part to inventory" />
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
            <span className="font-medium text-slate-900">{record.quantity} units &middot; {record.stock_status}</span>
          </div>
        )}
      />
    </div>
  );
};

export default InventoryManagerDashboard;
