import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getAllServiceRecords } from '../services/serviceRecord.service.js';
import { getAllServiceBookings } from '../services/serviceBooking.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import { getAllEmployees } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { buildVehicleNameMap, buildEmployeeNameMap } from '../utils/entityMaps.js';

const ServiceRecordsListPage = () => {
  const { user } = useAuth();
  const isAdmin = user.role === 'Admin';

  const records = useFetch(getAllServiceRecords, []);
  const bookings = useFetch(getAllServiceBookings, []);
  const vehicles = useFetch(getAllVehicles, []);
  // GET /api/employees is Admin-only, so a Technician never makes this call
  // and falls back to showing raw employee IDs — mirrors SalesListPage.
  const employees = useFetch(isAdmin ? getAllEmployees : () => Promise.resolve([]), [isAdmin]);

  const [searchTerm, setSearchTerm] = useState('');

  const vehicleMap = useMemo(() => buildVehicleNameMap(vehicles.data), [vehicles.data]);
  const bookingMap = useMemo(
    () => new Map((bookings.data || []).map((b) => [
      b.booking_id,
      `${b.service_type} — ${vehicleMap.get(b.vehicle_id) || `Vehicle #${b.vehicle_id}`}`
    ])),
    [bookings.data, vehicleMap]
  );
  const employeeMap = useMemo(() => buildEmployeeNameMap(employees.data), [employees.data]);

  const enrichedRecords = useMemo(() => {
    if (!records.data) return [];
    return records.data.map((record) => ({
      ...record,
      bookingSummary: bookingMap.get(record.booking_id) || `Booking #${record.booking_id}`,
      employeeName: isAdmin ? employeeMap.get(record.employee_id) || `Employee #${record.employee_id}` : `Employee #${record.employee_id}`
    }));
  }, [records.data, bookingMap, employeeMap, isAdmin]);

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return enrichedRecords;
    return enrichedRecords.filter(
      (record) =>
        record.work_description.toLowerCase().includes(term) ||
        record.bookingSummary.toLowerCase().includes(term) ||
        record.employeeName.toLowerCase().includes(term) ||
        record.service_status.toLowerCase().includes(term)
    );
  }, [enrichedRecords, searchTerm]);

  if (records.loading || bookings.loading || vehicles.loading) return <Loader />;
  if (records.error) return <ErrorBanner message="Unable to load service records right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Records</h1>
        <Link
          to="/service-records/new"
          className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Create Record
        </Link>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by booking, technician, work description, or status"
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!records.data || records.data.length === 0) && (
        <p className="text-gray-500">No service records yet. Click "Create Record" to add one.</p>
      )}

      {records.data && records.data.length > 0 && filteredRecords.length === 0 && (
        <p className="text-gray-500">No service records match your search.</p>
      )}

      {filteredRecords.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Booking</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Work Description</th>
                <th className="px-4 py-3 font-medium">Total Cost</th>
                <th className="px-4 py-3 font-medium">Completion Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.record_id}>
                  <td className="px-4 py-3">
                    <Link to={`/service-records/${record.record_id}`} className="font-medium text-gray-900 hover:underline">
                      {record.bookingSummary}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{record.employeeName}</td>
                  <td className="px-4 py-3 text-gray-700">{record.work_description}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(record.total_cost)}</td>
                  <td className="px-4 py-3 text-gray-700">{String(record.completion_date).slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={record.service_status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/service-records/${record.record_id}/edit`} className="text-gray-600 hover:text-gray-900">
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

export default ServiceRecordsListPage;
