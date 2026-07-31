import useFetch from '../../hooks/useFetch.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllCustomers } from '../../services/customer.service.js';
import { getAllEmployees } from '../../services/employee.service.js';
import { getAllSales } from '../../services/sales.service.js';
import { getAllInventory } from '../../services/inventory.service.js';
import { getAllSpareParts } from '../../services/spareParts.service.js';
import { getAllServiceBookings } from '../../services/serviceBooking.service.js';
import { getAllServiceRecords } from '../../services/serviceRecord.service.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import RecentActivityList from '../../components/RecentActivityList.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const AdminDashboard = () => {
  const vehicles = useFetch(getAllVehicles, []);
  const customers = useFetch(getAllCustomers, []);
  const employees = useFetch(getAllEmployees, []);
  const sales = useFetch(getAllSales, []);
  const inventory = useFetch(getAllInventory, []);
  const spareParts = useFetch(getAllSpareParts, []);
  const serviceBookings = useFetch(getAllServiceBookings, []);
  const serviceRecords = useFetch(getAllServiceRecords, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard label="Customers" value={customers.data?.length} loading={customers.loading} error={customers.error} />
        <DashboardCard label="Employees" value={employees.data?.length} loading={employees.loading} error={employees.error} />
        <DashboardCard label="Sales" value={sales.data?.length} loading={sales.loading} error={sales.error} />
        <DashboardCard label="Inventory Records" value={inventory.data?.length} loading={inventory.loading} error={inventory.error} />
        <DashboardCard label="Spare Parts" value={spareParts.data?.length} loading={spareParts.loading} error={spareParts.error} />
        <DashboardCard label="Service Bookings" value={serviceBookings.data?.length} loading={serviceBookings.loading} error={serviceBookings.error} />
        <DashboardCard label="Service Records" value={serviceRecords.data?.length} loading={serviceRecords.loading} error={serviceRecords.error} />
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

export default AdminDashboard;
