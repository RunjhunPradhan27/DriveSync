import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ServiceRecordForm from '../components/ServiceRecordForm.jsx';
import { createServiceRecord } from '../services/serviceRecord.service.js';

const CreateServiceRecordPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createServiceRecord(values);
      navigate(`/service-records/${created.record_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create this service record right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to="/service-records" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to service records
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Create Service Record</h1>
      <ServiceRecordForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Create Record" />
    </div>
  );
};

export default CreateServiceRecordPage;
