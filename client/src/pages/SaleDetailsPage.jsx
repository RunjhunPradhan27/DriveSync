import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getSaleById, deleteSale } from '../services/sales.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';

const SaleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sale, loading, error } = useFetch(() => getSaleById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This sale could not be found.' : 'Unable to load this sale right now.'} />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this sale record? This cannot be undone.');
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteSale(id);
      navigate('/sales');
    } catch (err) {
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this sale right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/sales" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to sales
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Sale #{sale.sale_id}</h1>
          <div className="flex gap-2">
            <Link
              to={`/sales/${id}/edit`}
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
            <dt className="text-gray-500">Customer</dt>
            <dd>
              <Link to={`/customers/${sale.customer_id}`} className="font-medium text-gray-900 hover:underline">
                View Customer #{sale.customer_id}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Vehicle</dt>
            <dd>
              <Link to={`/vehicles/${sale.vehicle_id}`} className="font-medium text-gray-900 hover:underline">
                View Vehicle #{sale.vehicle_id}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Employee</dt>
            <dd className="font-medium text-gray-900">Employee #{sale.employee_id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Sale Date</dt>
            <dd className="font-medium text-gray-900">{String(sale.sale_date).slice(0, 10)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Sale Price</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(sale.sale_price)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment Method</dt>
            <dd className="font-medium text-gray-900">{sale.payment_method}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className="font-medium text-gray-900">{sale.sale_status}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SaleDetailsPage;
