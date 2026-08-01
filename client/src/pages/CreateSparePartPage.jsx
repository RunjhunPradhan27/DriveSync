import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SparePartForm from '../components/SparePartForm.jsx';
import Card from '../components/ui/Card.jsx';
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
    <div className="max-w-lg">
      <Link to="/spare-parts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to spare parts
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Add Spare Part</h1>
      <Card>
        <SparePartForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Add Spare Part" />
      </Card>
    </div>
  );
};

export default CreateSparePartPage;
