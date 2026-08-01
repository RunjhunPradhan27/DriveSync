import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CustomerForm from '../components/CustomerForm.jsx';
import Card from '../components/ui/Card.jsx';
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
    <div className="max-w-lg">
      <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Add Customer</h1>
      <Card>
        <CustomerForm mode="create" onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
      </Card>
    </div>
  );
};

export default CreateCustomerPage;
