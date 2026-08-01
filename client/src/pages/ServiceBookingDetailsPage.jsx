import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Car, Calendar, Wrench, Activity, MessageSquare } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getServiceBookingById, deleteServiceBooking } from '../services/serviceBooking.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';

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
      <Link to="/service-bookings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to service bookings
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Booking #{booking.booking_id}</h1>
          {canManage && (
            <div className="flex gap-2">
              <LinkButton to={`/service-bookings/${id}/edit`} variant="secondary" size="sm">
                Edit
              </LinkButton>
              <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <DetailField
            icon={User}
            label="Customer"
            // /customers/:id is Admin/Sales-Executive-only, so a Technician
            // viewing this page would hit a permission wall — show plain
            // text instead of a dead-end link for that role.
            value={
              canManage ? (
                <Link to={`/customers/${booking.customer_id}`} className="hover:text-indigo-600 hover:underline">
                  View Customer #{booking.customer_id}
                </Link>
              ) : (
                `Customer #${booking.customer_id}`
              )
            }
          />
          <DetailField
            icon={Car}
            label="Vehicle"
            value={
              <Link to={`/vehicles/${booking.vehicle_id}`} className="hover:text-indigo-600 hover:underline">
                View Vehicle #{booking.vehicle_id}
              </Link>
            }
          />
          <DetailField icon={Calendar} label="Service Date" value={String(booking.service_date).slice(0, 10)} />
          <DetailField icon={Wrench} label="Service Type" value={booking.service_type} />
          <DetailField icon={Activity} label="Status" value={<StatusBadge status={booking.service_status} />} />
          <DetailField icon={MessageSquare} label="Remarks" value={booking.remarks || '—'} className="sm:col-span-2" />
        </dl>
      </Card>
    </div>
  );
};

export default ServiceBookingDetailsPage;
