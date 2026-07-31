import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getAllSales } from '../services/sales.service.js';
import { getAllCustomers } from '../services/customer.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import { getAllEmployees } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';

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

  const customerMap = useMemo(
    () => new Map((customers.data || []).map((c) => [c.customer_id, `${c.first_name} ${c.last_name}`])),
    [customers.data]
  );
  const vehicleMap = useMemo(
    () => new Map((vehicles.data || []).map((v) => [v.vehicle_id, `${v.make} ${v.model}`])),
    [vehicles.data]
  );
  const employeeMap = useMemo(
    () => new Map((employees.data || []).map((e) => [e.employee_id, `${e.first_name} ${e.last_name}`])),
    [employees.data]
  );

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

  if (sales.loading || customers.loading || vehicles.loading) return <Loader />;
  if (sales.error) return <ErrorBanner message="Unable to load sales right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <Link
          to="/sales/new"
          className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Create Sale
        </Link>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by customer, vehicle, payment method, or status"
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!sales.data || sales.data.length === 0) && (
        <p className="text-gray-500">No sales recorded yet. Click "Create Sale" to add one.</p>
      )}

      {sales.data && sales.data.length > 0 && filteredSales.length === 0 && (
        <p className="text-gray-500">No sales match your search.</p>
      )}

      {filteredSales.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Sale Price</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td className="px-4 py-3">
                    <Link to={`/sales/${sale.sale_id}`} className="font-medium text-gray-900 hover:underline">
                      {sale.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{sale.vehicleName}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(sale.sale_price)}</td>
                  <td className="px-4 py-3 text-gray-700">{sale.payment_method}</td>
                  <td className="px-4 py-3 text-gray-700">{sale.sale_status}</td>
                  <td className="px-4 py-3">
                    <Link to={`/sales/${sale.sale_id}/edit`} className="text-gray-600 hover:text-gray-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesListPage;
