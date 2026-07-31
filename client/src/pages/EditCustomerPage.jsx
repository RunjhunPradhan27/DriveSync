import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import CustomerForm from '../components/CustomerForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { getCustomerById, updateCustomer } from '../services/customer.service.js';

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, loading, error } = useFetch(() => getCustomerById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner
        message={notFound ? 'This customer could not be found.' : 'Unable to load this customer right now.'}
      />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateCustomer(id, values);
      navigate(`/customers/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to={`/customers/${id}`} className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to customer
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Edit Customer</h1>
      <CustomerForm
        mode="edit"
        initialValues={customer}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  );
};

export default EditCustomerPage;
