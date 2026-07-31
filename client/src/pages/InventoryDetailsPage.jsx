import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getInventoryById, deleteInventory } from '../services/inventory.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

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
      <Link to="/inventory" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to inventory
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Inventory #{record.inventory_id}</h1>
          <div className="flex gap-2">
            <Link
              to={`/inventory/${id}/edit`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Vehicle</dt>
            <dd>
              <Link to={`/vehicles/${record.vehicle_id}`} className="font-medium text-gray-900 hover:underline">
                View Vehicle #{record.vehicle_id}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Quantity</dt>
            <dd className="font-medium text-gray-900">{record.quantity}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Stock Status</dt>
            <dd><StatusBadge status={record.stock_status} /></dd>
          </div>
          <div>
            <dt className="text-gray-500">Storage Location</dt>
            <dd className="font-medium text-gray-900">{record.storage_location}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last Updated</dt>
            <dd className="font-medium text-gray-900">{String(record.last_updated).slice(0, 10)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default InventoryDetailsPage;
