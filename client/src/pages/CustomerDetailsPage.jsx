import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getCustomerById, deleteCustomer } from '../services/customer.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';

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
      <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {customer.first_name} {customer.last_name}
          </h1>
          <div className="flex gap-2">
            <LinkButton to={`/customers/${id}/edit`} variant="secondary" size="sm">
              Edit
            </LinkButton>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <DetailField icon={Mail} label="Email" value={customer.email} />
          <DetailField icon={Phone} label="Phone" value={customer.phone} />
          <DetailField icon={MapPin} label="Address" value={customer.address || '—'} />
          <DetailField icon={Building2} label="City" value={customer.city || '—'} />
        </dl>
      </Card>
    </div>
  );
};

export default CustomerDetailsPage;
