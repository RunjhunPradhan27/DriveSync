import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm.jsx';
import { createCustomer } from '../services/customer.service.js';

const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createCustomer(values);
      navigate(`/customers/${created.customer_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create customer right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Link to="/customers" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to customers
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Add Customer</h1>
      <CustomerForm mode="create" onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
    </div>
  );
};

export default CreateCustomerPage;
