import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ServiceRecordForm from '../components/ServiceRecordForm.jsx';
import Card from '../components/ui/Card.jsx';
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
    <div className="max-w-lg">
      <Link to="/service-records" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to service records
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Create Service Record</h1>
      <Card>
        <ServiceRecordForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Create Record" />
      </Card>
    </div>
  );
};

export default CreateServiceRecordPage;
