import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Pencil } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllSales } from '../services/sales.service.js';
import { getAllCustomers } from '../services/customer.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import { getAllEmployees } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { buildCustomerNameMap, buildVehicleNameMap, buildEmployeeNameMap } from '../utils/entityMaps.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const SalesListPage = () => {
  const { user } = useAuth();
  const isAdmin = user.role === 'Admin';

  const sales = useFetch(getAllSales, []);
  const customers = useFetch(getAllCustomers, []);
  const vehicles = useFetch(getAllVehicles, []);
  // GET /api/employees is Admin-only, so Sales Executive never makes this
  // call (see fetcher below) and falls back to showing raw employee IDs.
  const employees = useFetch(isAdmin ? getAllEmployees : () => Promise.resolve([]), [isAdmin]);

  const [searchTerm, setSearchTerm] = useState('');

  const customerMap = useMemo(() => buildCustomerNameMap(customers.data), [customers.data]);
  const vehicleMap = useMemo(() => buildVehicleNameMap(vehicles.data), [vehicles.data]);
  const employeeMap = useMemo(() => buildEmployeeNameMap(employees.data), [employees.data]);

  const enrichedSales = useMemo(() => {
    if (!sales.data) return [];
    return sales.data.map((sale) => ({
      ...sale,
      customerName: customerMap.get(sale.customer_id) || `Customer #${sale.customer_id}`,
      vehicleName: vehicleMap.get(sale.vehicle_id) || `Vehicle #${sale.vehicle_id}`,
      employeeName: isAdmin ? employeeMap.get(sale.employee_id) || `Employee #${sale.employee_id}` : `Employee #${sale.employee_id}`
    }));
  }, [sales.data, customerMap, vehicleMap, employeeMap, isAdmin]);

  const filteredSales = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return enrichedSales;
    return enrichedSales.filter(
      (sale) =>
        sale.customerName.toLowerCase().includes(term) ||
        sale.vehicleName.toLowerCase().includes(term) ||
        sale.payment_method.toLowerCase().includes(term) ||
        sale.sale_status.toLowerCase().includes(term)
    );
  }, [enrichedSales, searchTerm]);

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredSales, 10);

  if (sales.loading || customers.loading || vehicles.loading) return <Loader />;
  if (sales.error) return <ErrorBanner message="Unable to load sales right now." />;

  return (
    <div>
      <PageHeader
        icon={Receipt}
        title="Sales"
        description="All vehicle sale transactions"
        actions={<LinkButton to="/sales/new">Create Sale</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by customer, vehicle, payment method, or status"
        className="mb-4"
      />

      {(!sales.data || sales.data.length === 0) && (
        <EmptyState icon={Receipt} title="No sales recorded yet" description='Click "Create Sale" to add one.' />
      )}

      {sales.data && sales.data.length > 0 && filteredSales.length === 0 && (
        <EmptyState icon={Receipt} title="No sales match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Customer</th>
              <th className={thClass}>Vehicle</th>
              <th className={thClass}>Sale Price</th>
              <th className={thClass}>Payment</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((sale) => (
              <tr key={sale.sale_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/sales/${sale.sale_id}`} className="hover:text-indigo-600">
                    {sale.customerName}
                  </Link>
                </td>
                <td className={tdClass}>{sale.vehicleName}</td>
                <td className={tdClass}>{formatCurrency(sale.sale_price)}</td>
                <td className={tdClass}>{sale.payment_method}</td>
                <td className={tdClass}>
                  <StatusBadge status={sale.sale_status} />
                </td>
                <td className={tdClass}>
                  <IconLinkButton to={`/sales/${sale.sale_id}/edit`} icon={Pencil} label="Edit sale" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} total={total} pageSize={pageSize} />
    </div>
  );
};

export default SalesListPage;
