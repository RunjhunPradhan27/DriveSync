import { LayoutDashboard, Car, Package, CalendarClock, ClipboardList, Wrench } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllSpareParts } from '../../services/spareParts.service.js';
import { getAllServiceBookings } from '../../services/serviceBooking.service.js';
import { getAllServiceRecords } from '../../services/serviceRecord.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import QuickActionCard from '../../components/ui/QuickActionCard.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const TechnicianDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const spareParts = useFetch(getAllSpareParts, []);
  const serviceBookings = useFetch(getAllServiceBookings, []);
  const serviceRecords = useFetch(getAllServiceRecords, []);

  return (
    <div>
      <PageHeader icon={LayoutDashboard} title="Technician Dashboard" description="Your service queue and work history" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard icon={Car} accent="indigo" label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard icon={Package} accent="amber" label="Spare Parts" value={spareParts.data?.length} loading={spareParts.loading} error={spareParts.error} />
        <DashboardCard icon={CalendarClock} accent="rose" label="Service Bookings" value={serviceBookings.data?.length} loading={serviceBookings.loading} error={serviceBookings.error} />
        <DashboardCard icon={ClipboardList} accent="emerald" label="Service Records" value={serviceRecords.data?.length} loading={serviceRecords.loading} error={serviceRecords.error} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickActionCard to="/service-records/new" icon={Wrench} title="Log Service Record" description="Record completed work" />
        <QuickActionCard to="/service-bookings" icon={CalendarClock} title="View Bookings" description="See scheduled service visits" />
        <QuickActionCard to="/spare-parts" icon={Package} title="View Spare Parts" description="Check current stock levels" />
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
            <span className="font-medium text-slate-900">{formatCurrency(record.total_cost)}</span>
          </div>
        )}
      />
    </div>
  );
};

export default TechnicianDashboard;
