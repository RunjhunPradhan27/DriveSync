import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SparePartForm from '../components/SparePartForm.jsx';
import { createSparePart } from '../services/spareParts.service.js';

const CreateSparePartPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createSparePart(values);
      navigate(`/spare-parts/${created.part_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create this spare part right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to="/spare-parts" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to spare parts
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Add Spare Part</h1>
      <SparePartForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Add Spare Part" />
    </div>
  );
};

export default CreateSparePartPage;
