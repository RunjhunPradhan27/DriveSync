import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getSparePartById, deleteSparePart } from '../services/spareParts.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';

const SparePartDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user.role === 'Admin' || user.role === 'Inventory Manager';

  const { data: part, loading, error } = useFetch(() => getSparePartById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This spare part could not be found.' : 'Unable to load this spare part right now.'} />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this spare part? This cannot be undone.');
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteSparePart(id);
      navigate('/spare-parts');
    } catch (err) {
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this spare part right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/spare-parts" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to spare parts
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{part.part_name}</h1>
          {canManage && (
            <div className="flex gap-2">
              <Link
                to={`/spare-parts/${id}/edit`}
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
          )}
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Part Number</dt>
            <dd className="font-medium text-gray-900">{part.part_number}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Quantity</dt>
            <dd className="font-medium text-gray-900">{part.quantity}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Unit Price</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(part.unit_price)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Supplier</dt>
            <dd className="font-medium text-gray-900">{part.supplier_name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last Updated</dt>
            <dd className="font-medium text-gray-900">{String(part.last_updated).slice(0, 10)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SparePartDetailsPage;
