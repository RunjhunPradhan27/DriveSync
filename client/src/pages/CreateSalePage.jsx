import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SaleForm from '../components/SaleForm.jsx';
import Card from '../components/ui/Card.jsx';
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
    <div className="max-w-lg">
      <Link to="/sales" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to sales
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Create Sale</h1>
      <Card>
        <SaleForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Create Sale" />
      </Card>
    </div>
  );
};

export default CreateSalePage;
