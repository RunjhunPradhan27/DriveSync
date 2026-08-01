import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getServiceRecordById, deleteServiceRecord } from '../services/serviceRecord.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/formatters.js';

const ServiceRecordDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: record, loading, error } = useFetch(() => getServiceRecordById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This service record could not be found.' : 'Unable to load this service record right now.'} />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this service record? This cannot be undone.');
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteServiceRecord(id);
      navigate('/service-records');
    } catch (err) {
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this service record right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/service-records" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to service records
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Record #{record.record_id}</h1>
          <div className="flex gap-2">
            <Link
              to={`/service-records/${id}/edit`}
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
            <dt className="text-gray-500">Service Booking</dt>
            <dd>
              <Link to={`/service-bookings/${record.booking_id}`} className="font-medium text-gray-900 hover:underline">
                View Booking #{record.booking_id}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Technician</dt>
            {/* No employee-details page exists yet, so unlike the booking
                link this is always plain text, matching how SaleDetailsPage
                shows employee_id without a link. */}
            <dd className="font-medium text-gray-900">Employee #{record.employee_id}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-500">Work Description</dt>
            <dd className="font-medium text-gray-900">{record.work_description}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Labour Cost</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(record.labour_cost)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Parts Cost</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(record.parts_cost)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Total Cost</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(record.total_cost)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Completion Date</dt>
            <dd className="font-medium text-gray-900">{String(record.completion_date).slice(0, 10)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd><StatusBadge status={record.service_status} /></dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ServiceRecordDetailsPage;
