import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getCustomerById, deleteCustomer } from '../services/customer.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, loading, error } = useFetch(() => getCustomerById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner
        message={notFound ? 'This customer could not be found.' : 'Unable to load this customer right now.'}
      />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${customer.first_name} ${customer.last_name}? This cannot be undone.`);
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteCustomer(id);
      navigate('/customers');
    } catch (err) {
      // A 409 here means the customer has existing sales records referencing
      // them (RESTRICT foreign key) — surface the backend's own message.
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this customer right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/customers" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to customers
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.first_name} {customer.last_name}
          </h1>
          <div className="flex gap-2">
            <Link
              to={`/customers/${id}/edit`}
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
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-900">{customer.phone}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Address</dt>
            <dd className="font-medium text-gray-900">{customer.address || '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">City</dt>
            <dd className="font-medium text-gray-900">{customer.city || '—'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
