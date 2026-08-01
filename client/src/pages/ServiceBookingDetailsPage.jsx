import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getServiceBookingById, deleteServiceBooking } from '../services/serviceBooking.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const ServiceBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user.role === 'Admin' || user.role === 'Sales Executive';

  const { data: booking, loading, error } = useFetch(() => getServiceBookingById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This service booking could not be found.' : 'Unable to load this service booking right now.'} />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this service booking? This cannot be undone.');
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteServiceBooking(id);
      navigate('/service-bookings');
    } catch (err) {
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this service booking right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/service-bookings" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to service bookings
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.booking_id}</h1>
          {canManage && (
            <div className="flex gap-2">
              <Link
                to={`/service-bookings/${id}/edit`}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Customer</dt>
            <dd>
              {/* /customers/:id is Admin/Sales-Executive-only, so a Technician
                  viewing this page would hit a permission wall — show plain
                  text instead of a dead-end link for that role. */}
              {canManage ? (
                <Link to={`/customers/${booking.customer_id}`} className="font-medium text-gray-900 hover:underline">
                  View Customer #{booking.customer_id}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">Customer #{booking.customer_id}</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Vehicle</dt>
            <dd>
              <Link to={`/vehicles/${booking.vehicle_id}`} className="font-medium text-gray-900 hover:underline">
                View Vehicle #{booking.vehicle_id}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Service Date</dt>
            <dd className="font-medium text-gray-900">{String(booking.service_date).slice(0, 10)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Service Type</dt>
            <dd className="font-medium text-gray-900">{booking.service_type}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd><StatusBadge status={booking.service_status} /></dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-500">Remarks</dt>
            <dd className="font-medium text-gray-900">{booking.remarks || '—'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ServiceBookingDetailsPage;
