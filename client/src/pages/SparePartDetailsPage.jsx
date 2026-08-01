import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash, Layers, IndianRupee, Truck, Clock } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getSparePartById, deleteSparePart } from '../services/spareParts.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';
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
      <Link to="/spare-parts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to spare parts
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{part.part_name}</h1>
          {canManage && (
            <div className="flex gap-2">
              <LinkButton to={`/spare-parts/${id}/edit`} variant="secondary" size="sm">
                Edit
              </LinkButton>
              <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <DetailField icon={Hash} label="Part Number" value={part.part_number} mono />
          <DetailField icon={Layers} label="Quantity" value={part.quantity} />
          <DetailField icon={IndianRupee} label="Unit Price" value={formatCurrency(part.unit_price)} />
          <DetailField icon={Truck} label="Supplier" value={part.supplier_name} />
          <DetailField icon={Clock} label="Last Updated" value={String(part.last_updated).slice(0, 10)} />
        </dl>
      </Card>
    </div>
  );
};

export default SparePartDetailsPage;
