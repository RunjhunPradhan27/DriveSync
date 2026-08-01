import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ServiceBookingForm from '../components/ServiceBookingForm.jsx';
import { createServiceBooking } from '../services/serviceBooking.service.js';

const CreateServiceBookingPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createServiceBooking(values);
      navigate(`/service-bookings/${created.booking_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create this service booking right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to="/service-bookings" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to service bookings
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Create Service Booking</h1>
      <ServiceBookingForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Create Booking" />
    </div>
  );
};

export default CreateServiceBookingPage;
