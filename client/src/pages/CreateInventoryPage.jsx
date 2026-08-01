import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InventoryForm from '../components/InventoryForm.jsx';
import Card from '../components/ui/Card.jsx';
import { createInventory } from '../services/inventory.service.js';

const CreateInventoryPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createInventory(values);
      navigate(`/inventory/${created.inventory_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create this inventory record right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link to="/inventory" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Add Stock Record</h1>
      <Card>
        <InventoryForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Add Stock Record" />
      </Card>
    </div>
  );
};

export default CreateInventoryPage;
