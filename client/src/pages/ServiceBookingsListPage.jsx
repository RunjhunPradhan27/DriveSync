import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Pencil } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllServiceBookings } from '../services/serviceBooking.service.js';
import { getAllCustomers } from '../services/customer.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { buildCustomerNameMap, buildVehicleNameMap } from '../utils/entityMaps.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const ServiceBookingsListPage = () => {
  const { user } = useAuth();
  const canManage = user.role === 'Admin' || user.role === 'Sales Executive';

  const bookings = useFetch(getAllServiceBookings, []);
  // GET /api/customers is Admin/Sales-Executive-only, so a Technician (who
  // only has view access to bookings) never makes this call and falls back
  // to showing raw customer IDs — mirrors SalesListPage's employee fetch.
  const customers = useFetch(canManage ? getAllCustomers : () => Promise.resolve([]), [canManage]);
  const vehicles = useFetch(getAllVehicles, []);

  const [searchTerm, setSearchTerm] = useState('');

  const customerMap = useMemo(() => buildCustomerNameMap(customers.data), [customers.data]);
  const vehicleMap = useMemo(() => buildVehicleNameMap(vehicles.data), [vehicles.data]);

  const enrichedBookings = useMemo(() => {
    if (!bookings.data) return [];
    return bookings.data.map((booking) => ({
      ...booking,
      customerName: customerMap.get(booking.customer_id) || `Customer #${booking.customer_id}`,
      vehicleName: vehicleMap.get(booking.vehicle_id) || `Vehicle #${booking.vehicle_id}`
    }));
  }, [bookings.data, customerMap, vehicleMap]);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return enrichedBookings;
    return enrichedBookings.filter(
      (booking) =>
        booking.customerName.toLowerCase().includes(term) ||
        booking.vehicleName.toLowerCase().includes(term) ||
        booking.service_type.toLowerCase().includes(term) ||
        booking.service_status.toLowerCase().includes(term)
    );
  }, [enrichedBookings, searchTerm]);

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredBookings, 10);

  if (bookings.loading || customers.loading || vehicles.loading) return <Loader />;
  if (bookings.error) return <ErrorBanner message="Unable to load service bookings right now." />;

  return (
    <div>
      <PageHeader
        icon={CalendarClock}
        title="Service Bookings"
        description="Scheduled and completed service appointments"
        actions={canManage && <LinkButton to="/service-bookings/new">Create Booking</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by customer, vehicle, service type, or status"
        className="mb-4"
      />

      {(!bookings.data || bookings.data.length === 0) && (
        <EmptyState icon={CalendarClock} title="No service bookings yet" description={canManage ? 'Click "Create Booking" to add one.' : undefined} />
      )}

      {bookings.data && bookings.data.length > 0 && filteredBookings.length === 0 && (
        <EmptyState icon={CalendarClock} title="No service bookings match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Customer</th>
              <th className={thClass}>Vehicle</th>
              <th className={thClass}>Service Date</th>
              <th className={thClass}>Service Type</th>
              <th className={thClass}>Status</th>
              {canManage && <th className={thClass}>Actions</th>}
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((booking) => (
              <tr key={booking.booking_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/service-bookings/${booking.booking_id}`} className="hover:text-indigo-600">
                    {booking.customerName}
                  </Link>
                </td>
                <td className={tdClass}>{booking.vehicleName}</td>
                <td className={tdClass}>{String(booking.service_date).slice(0, 10)}</td>
                <td className={tdClass}>{booking.service_type}</td>
                <td className={tdClass}>
                  <StatusBadge status={booking.service_status} />
                </td>
                {canManage && (
                  <td className={tdClass}>
                    <IconLinkButton to={`/service-bookings/${booking.booking_id}/edit`} icon={Pencil} label="Edit service booking" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} total={total} pageSize={pageSize} />
    </div>
  );
};

export default ServiceBookingsListPage;
