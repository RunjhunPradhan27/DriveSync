import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SaleForm from '../components/SaleForm.jsx';
import { createSale } from '../services/sales.service.js';

const CreateSalePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createSale(values);
      navigate(`/sales/${created.sale_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create this sale right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to="/sales" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to sales
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Create Sale</h1>
      <SaleForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Create Sale" />
    </div>
  );
};

export default CreateSalePage;
