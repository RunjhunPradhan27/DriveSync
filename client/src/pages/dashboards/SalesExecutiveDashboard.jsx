import { LayoutDashboard, Car, Users, Receipt, CalendarClock, UserPlus } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllCustomers } from '../../services/customer.service.js';
import { getAllSales } from '../../services/sales.service.js';
import { getAllServiceBookings } from '../../services/serviceBooking.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import QuickActionCard from '../../components/ui/QuickActionCard.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const SalesExecutiveDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const customers = useFetch(getAllCustomers, []);
  const sales = useFetch(getAllSales, []);
  const serviceBookings = useFetch(getAllServiceBookings, []);

  return (
    <div>
      <PageHeader icon={LayoutDashboard} title="Sales Dashboard" description="Your customers, vehicles, and deal pipeline" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard icon={Car} accent="indigo" label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard icon={Users} accent="blue" label="Customers" value={customers.data?.length} loading={customers.loading} error={customers.error} />
        <DashboardCard icon={Receipt} accent="emerald" label="Sales" value={sales.data?.length} loading={sales.loading} error={sales.error} />
        <DashboardCard icon={CalendarClock} accent="rose" label="Service Bookings" value={serviceBookings.data?.length} loading={serviceBookings.loading} error={serviceBookings.error} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickActionCard to="/sales/new" icon={Receipt} title="New Sale" description="Record a vehicle sale" />
        <QuickActionCard to="/customers/new" icon={UserPlus} title="Add Customer" description="Register a new customer" />
        <QuickActionCard to="/service-bookings/new" icon={CalendarClock} title="New Booking" description="Schedule a service visit" />
      </div>

      <RecentActivityList
        title="Recent Sales"
        items={sales.data?.slice(0, 5)}
        loading={sales.loading}
        error={sales.error}
        emptyMessage="No sales recorded yet."
        renderItem={(sale) => (
          <div className="flex items-center justify-between">
            <span>Sale #{sale.sale_id} &middot; {sale.payment_method} &middot; {sale.sale_status}</span>
            <span className="font-medium text-slate-900">{formatCurrency(sale.sale_price)}</span>
          </div>
        )}
      />
    </div>
  );
};

export default SalesExecutiveDashboard;
