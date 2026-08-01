import { LayoutDashboard, Car, Users, UserCog, Receipt, Boxes, Package, CalendarClock, ClipboardList, UserPlus } from 'lucide-react';
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
import PageHeader from '../../components/ui/PageHeader.jsx';
import QuickActionCard from '../../components/ui/QuickActionCard.jsx';
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
      <PageHeader icon={LayoutDashboard} title="Admin Dashboard" description="Dealership-wide overview across every module" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard icon={Car} accent="indigo" label="Vehicles" value={vehicles.data?.length} loading={vehicles.loading} error={vehicles.error} />
        <DashboardCard icon={Users} accent="blue" label="Customers" value={customers.data?.length} loading={customers.loading} error={customers.error} />
        <DashboardCard icon={UserCog} accent="slate" label="Employees" value={employees.data?.length} loading={employees.loading} error={employees.error} />
        <DashboardCard icon={Receipt} accent="emerald" label="Sales" value={sales.data?.length} loading={sales.loading} error={sales.error} />
        <DashboardCard icon={Boxes} accent="amber" label="Inventory Records" value={inventory.data?.length} loading={inventory.loading} error={inventory.error} />
        <DashboardCard icon={Package} accent="amber" label="Spare Parts" value={spareParts.data?.length} loading={spareParts.loading} error={spareParts.error} />
        <DashboardCard icon={CalendarClock} accent="rose" label="Service Bookings" value={serviceBookings.data?.length} loading={serviceBookings.loading} error={serviceBookings.error} />
        <DashboardCard icon={ClipboardList} accent="rose" label="Service Records" value={serviceRecords.data?.length} loading={serviceRecords.loading} error={serviceRecords.error} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard to="/sales/new" icon={Receipt} title="New Sale" description="Record a vehicle sale" />
        <QuickActionCard to="/customers/new" icon={UserPlus} title="Add Customer" description="Register a new customer" />
        <QuickActionCard to="/employees/new" icon={UserCog} title="Add Employee" description="Provision a staff account" />
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

export default AdminDashboard;
