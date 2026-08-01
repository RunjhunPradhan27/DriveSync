import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Pencil } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllServiceRecords } from '../services/serviceRecord.service.js';
import { getAllServiceBookings } from '../services/serviceBooking.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import { getAllEmployees } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { buildVehicleNameMap, buildEmployeeNameMap } from '../utils/entityMaps.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

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

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredRecords, 10);

  if (records.loading || bookings.loading || vehicles.loading) return <Loader />;
  if (records.error) return <ErrorBanner message="Unable to load service records right now." />;

  return (
    <div>
      <PageHeader
        icon={ClipboardList}
        title="Service Records"
        description="Completed and cancelled service work"
        actions={<LinkButton to="/service-records/new">Create Record</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by booking, technician, work description, or status"
        className="mb-4"
      />

      {(!records.data || records.data.length === 0) && (
        <EmptyState icon={ClipboardList} title="No service records yet" description='Click "Create Record" to add one.' />
      )}

      {records.data && records.data.length > 0 && filteredRecords.length === 0 && (
        <EmptyState icon={ClipboardList} title="No service records match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Booking</th>
              <th className={thClass}>Technician</th>
              <th className={thClass}>Work Description</th>
              <th className={thClass}>Total Cost</th>
              <th className={thClass}>Completion Date</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((record) => (
              <tr key={record.record_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/service-records/${record.record_id}`} className="hover:text-indigo-600">
                    {record.bookingSummary}
                  </Link>
                </td>
                <td className={tdClass}>{record.employeeName}</td>
                <td className={tdClass}>{record.work_description}</td>
                <td className={tdClass}>{formatCurrency(record.total_cost)}</td>
                <td className={tdClass}>{String(record.completion_date).slice(0, 10)}</td>
                <td className={tdClass}>
                  <StatusBadge status={record.service_status} />
                </td>
                <td className={tdClass}>
                  <IconLinkButton to={`/service-records/${record.record_id}/edit`} icon={Pencil} label="Edit service record" />
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

export default ServiceRecordsListPage;
