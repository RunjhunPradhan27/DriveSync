import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InventoryForm from '../components/InventoryForm.jsx';
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
    <div className="max-w-md">
      <Link to="/inventory" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to inventory
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Add Stock Record</h1>
      <InventoryForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} submitLabel="Add Stock Record" />
    </div>
  );
};

export default CreateInventoryPage;
