import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import InventoryForm from '../components/InventoryForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import { getInventoryById, updateInventory } from '../services/inventory.service.js';

const EditInventoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: record, loading, error } = useFetch(() => getInventoryById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This inventory record could not be found.' : 'Unable to load this inventory record right now.'} />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateInventory(id, values);
      navigate(`/inventory/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link to={`/inventory/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to inventory record
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Edit Inventory Record</h1>
      <Card>
        <InventoryForm
          initialValues={record}
          onSubmit={handleSubmit}
          submitting={submitting}
          serverError={serverError}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
};

export default EditInventoryPage;
