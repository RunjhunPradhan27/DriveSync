import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllSpareParts } from '../../services/spareParts.service.js';
import { getAllServiceBookings } from '../../services/serviceBooking.service.js';
import { getAllServiceRecords } from '../../services/serviceRecord.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const TechnicianDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const spareParts = useFetch(getAllSpareParts, []);
  const serviceBookings = useFetch(getAllServiceBookings, []);
  const serviceRecords = useFetch(getAllServiceRecords, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Technician Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard label="Spare Parts" value={spareParts.data?.length} loading={spareParts.loading} error={spareParts.error} />
        <DashboardCard label="Service Bookings" value={serviceBookings.data?.length} loading={serviceBookings.loading} error={serviceBookings.error} />
        <DashboardCard label="Service Records" value={serviceRecords.data?.length} loading={serviceRecords.loading} error={serviceRecords.error} />
      </div>

      <RecentActivityList
        title="Recent Service Records"
        items={serviceRecords.data?.slice(0, 5)}
        loading={serviceRecords.loading}
        error={serviceRecords.error}
        emptyMessage="No service records yet."
        renderItem={(record) => (
          <div className="flex items-center justify-between">
            <span>Record #{record.record_id} &middot; {record.work_description}</span>
            <span className="font-medium text-gray-900">{formatCurrency(record.total_cost)}</span>
          </div>
        )}
      />
    </div>
  );
};

export default TechnicianDashboard;
