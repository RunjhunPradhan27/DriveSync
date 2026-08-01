import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarClock, UserCog, FileText, IndianRupee, Calendar, Activity } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getServiceRecordById, deleteServiceRecord } from '../services/serviceRecord.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';
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
      <Link to="/service-records" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to service records
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Record #{record.record_id}</h1>
          <div className="flex gap-2">
            <LinkButton to={`/service-records/${id}/edit`} variant="secondary" size="sm">
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
            icon={CalendarClock}
            label="Service Booking"
            value={
              <Link to={`/service-bookings/${record.booking_id}`} className="hover:text-indigo-600 hover:underline">
                View Booking #{record.booking_id}
              </Link>
            }
          />
          {/* No employee-details page exists yet, so unlike the booking
              link this is always plain text, matching how SaleDetailsPage
              shows employee_id without a link. */}
          <DetailField icon={UserCog} label="Technician" value={`Employee #${record.employee_id}`} />
          <DetailField icon={FileText} label="Work Description" value={record.work_description} className="sm:col-span-2" />
          <DetailField icon={IndianRupee} label="Labour Cost" value={formatCurrency(record.labour_cost)} />
          <DetailField icon={IndianRupee} label="Parts Cost" value={formatCurrency(record.parts_cost)} />
          <DetailField icon={IndianRupee} label="Total Cost" value={formatCurrency(record.total_cost)} />
          <DetailField icon={Calendar} label="Completion Date" value={String(record.completion_date).slice(0, 10)} />
          <DetailField icon={Activity} label="Status" value={<StatusBadge status={record.service_status} />} />
        </dl>
      </Card>
    </div>
  );
};

export default ServiceRecordDetailsPage;
