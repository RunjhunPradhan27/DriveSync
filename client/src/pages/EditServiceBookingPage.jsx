import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import ServiceBookingForm from '../components/ServiceBookingForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { getServiceBookingById, updateServiceBooking } from '../services/serviceBooking.service.js';

const EditServiceBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: booking, loading, error } = useFetch(() => getServiceBookingById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This service booking could not be found.' : 'Unable to load this service booking right now.'} />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateServiceBooking(id, values);
      navigate(`/service-bookings/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to={`/service-bookings/${id}`} className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to service booking
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Edit Service Booking</h1>
      <ServiceBookingForm
        initialValues={{ ...booking, service_date: String(booking.service_date).slice(0, 10), remarks: booking.remarks || '' }}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditServiceBookingPage;
