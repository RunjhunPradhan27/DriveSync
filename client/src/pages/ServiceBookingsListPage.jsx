import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getAllServiceBookings } from '../services/serviceBooking.service.js';
import { getAllCustomers } from '../services/customer.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

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

  const customerMap = useMemo(
    () => new Map((customers.data || []).map((c) => [c.customer_id, `${c.first_name} ${c.last_name}`])),
    [customers.data]
  );
  const vehicleMap = useMemo(
    () => new Map((vehicles.data || []).map((v) => [v.vehicle_id, `${v.make} ${v.model}`])),
    [vehicles.data]
  );

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

  if (bookings.loading || customers.loading || vehicles.loading) return <Loader />;
  if (bookings.error) return <ErrorBanner message="Unable to load service bookings right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Bookings</h1>
        {canManage && (
          <Link
            to="/service-bookings/new"
            className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
          >
            Create Booking
          </Link>
        )}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by customer, vehicle, service type, or status"
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!bookings.data || bookings.data.length === 0) && (
        <p className="text-gray-500">
          No service bookings yet.{canManage ? ' Click "Create Booking" to add one.' : ''}
        </p>
      )}

      {bookings.data && bookings.data.length > 0 && filteredBookings.length === 0 && (
        <p className="text-gray-500">No service bookings match your search.</p>
      )}

      {filteredBookings.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Service Date</th>
                <th className="px-4 py-3 font-medium">Service Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {canManage && <th className="px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className="px-4 py-3">
                    <Link to={`/service-bookings/${booking.booking_id}`} className="font-medium text-gray-900 hover:underline">
                      {booking.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{booking.vehicleName}</td>
                  <td className="px-4 py-3 text-gray-700">{String(booking.service_date).slice(0, 10)}</td>
                  <td className="px-4 py-3 text-gray-700">{booking.service_type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.service_status} />
                  </td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <Link to={`/service-bookings/${booking.booking_id}/edit`} className="text-gray-600 hover:text-gray-900">
                        Edit
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceBookingsListPage;
