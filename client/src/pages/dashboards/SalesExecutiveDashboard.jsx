import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllCustomers } from '../../services/customer.service.js';
import { getAllSales } from '../../services/sales.service.js';
import { getAllServiceBookings } from '../../services/serviceBooking.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const SalesExecutiveDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const customers = useFetch(getAllCustomers, []);
  const sales = useFetch(getAllSales, []);
  const serviceBookings = useFetch(getAllServiceBookings, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard label="Customers" value={customers.data?.length} loading={customers.loading} error={customers.error} />
        <DashboardCard label="Sales" value={sales.data?.length} loading={sales.loading} error={sales.error} />
        <DashboardCard label="Service Bookings" value={serviceBookings.data?.length} loading={serviceBookings.loading} error={serviceBookings.error} />
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
            <span className="font-medium text-gray-900">{formatCurrency(sale.sale_price)}</span>
          </div>
        )}
      />
    </div>
  );
};

export default SalesExecutiveDashboard;
