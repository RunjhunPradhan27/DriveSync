import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Car, Layers, MapPin, Activity, Clock } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getInventoryById, deleteInventory } from '../services/inventory.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';

const InventoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: record, loading, error } = useFetch(() => getInventoryById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This inventory record could not be found.' : 'Unable to load this inventory record right now.'} />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this inventory record? This cannot be undone.');
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteInventory(id);
      navigate('/inventory');
    } catch (err) {
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this inventory record right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/inventory" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Inventory #{record.inventory_id}</h1>
          <div className="flex gap-2">
            <LinkButton to={`/inventory/${id}/edit`} variant="secondary" size="sm">
              Edit
            </LinkButton>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <DetailField
            icon={Car}
            label="Vehicle"
            value={
              <Link to={`/vehicles/${record.vehicle_id}`} className="hover:text-indigo-600 hover:underline">
                View Vehicle #{record.vehicle_id}
              </Link>
            }
          />
          <DetailField icon={Layers} label="Quantity" value={record.quantity} />
          <DetailField icon={Activity} label="Stock Status" value={<StatusBadge status={record.stock_status} />} />
          <DetailField icon={MapPin} label="Storage Location" value={record.storage_location} />
          <DetailField icon={Clock} label="Last Updated" value={String(record.last_updated).slice(0, 10)} />
        </dl>
      </Card>
    </div>
  );
};

export default InventoryDetailsPage;
