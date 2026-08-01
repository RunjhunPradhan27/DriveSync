import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Car, UserCog, Calendar, IndianRupee, CreditCard, Activity } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getSaleById, deleteSale } from '../services/sales.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';
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
      <Link to="/sales" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to sales
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Sale #{sale.sale_id}</h1>
          <div className="flex gap-2">
            <LinkButton to={`/sales/${id}/edit`} variant="secondary" size="sm">
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
            icon={User}
            label="Customer"
            value={
              <Link to={`/customers/${sale.customer_id}`} className="hover:text-indigo-600 hover:underline">
                View Customer #{sale.customer_id}
              </Link>
            }
          />
          <DetailField
            icon={Car}
            label="Vehicle"
            value={
              <Link to={`/vehicles/${sale.vehicle_id}`} className="hover:text-indigo-600 hover:underline">
                View Vehicle #{sale.vehicle_id}
              </Link>
            }
          />
          <DetailField icon={UserCog} label="Employee" value={`Employee #${sale.employee_id}`} />
          <DetailField icon={Calendar} label="Sale Date" value={String(sale.sale_date).slice(0, 10)} />
          <DetailField icon={IndianRupee} label="Sale Price" value={formatCurrency(sale.sale_price)} />
          <DetailField icon={CreditCard} label="Payment Method" value={sale.payment_method} />
          <DetailField icon={Activity} label="Status" value={<StatusBadge status={sale.sale_status} />} />
        </dl>
      </Card>
    </div>
  );
};

export default SaleDetailsPage;
