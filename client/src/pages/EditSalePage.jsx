import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import SaleForm from '../components/SaleForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import { getSaleById, updateSale } from '../services/sales.service.js';

const EditSalePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sale, loading, error } = useFetch(() => getSaleById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This sale could not be found.' : 'Unable to load this sale right now.'} />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateSale(id, values);
      navigate(`/sales/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link to={`/sales/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to sale
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Edit Sale</h1>
      <Card>
        <SaleForm
          initialValues={{ ...sale, sale_date: String(sale.sale_date).slice(0, 10) }}
          onSubmit={handleSubmit}
          submitting={submitting}
          serverError={serverError}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
};

export default EditSalePage;
