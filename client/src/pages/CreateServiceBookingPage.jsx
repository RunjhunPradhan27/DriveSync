import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ServiceBookingForm from '../components/ServiceBookingForm.jsx';
import Card from '../components/ui/Card.jsx';
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
    <div className="max-w-lg">
      <Link to="/service-bookings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to service bookings
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Create Service Booking</h1>
      <Card>
        <ServiceBookingForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Create Booking" />
      </Card>
    </div>
  );
};

export default CreateServiceBookingPage;
