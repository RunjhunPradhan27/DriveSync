import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import ServiceRecordForm from '../components/ServiceRecordForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { getServiceRecordById, updateServiceRecord } from '../services/serviceRecord.service.js';

const EditServiceRecordPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: record, loading, error } = useFetch(() => getServiceRecordById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This service record could not be found.' : 'Unable to load this service record right now.'} />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateServiceRecord(id, values);
      navigate(`/service-records/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to={`/service-records/${id}`} className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to service record
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Edit Service Record</h1>
      <ServiceRecordForm
        initialValues={{ ...record, completion_date: String(record.completion_date).slice(0, 10) }}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditServiceRecordPage;
