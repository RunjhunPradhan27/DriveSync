import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import SparePartForm from '../components/SparePartForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import { getSparePartById, updateSparePart } from '../services/spareParts.service.js';

const EditSparePartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: part, loading, error } = useFetch(() => getSparePartById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This spare part could not be found.' : 'Unable to load this spare part right now.'} />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateSparePart(id, values);
      navigate(`/spare-parts/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link to={`/spare-parts/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to spare part
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Edit Spare Part</h1>
      <Card>
        <SparePartForm
          initialValues={part}
          onSubmit={handleSubmit}
          submitting={submitting}
          serverError={serverError}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
};

export default EditSparePartPage;
