import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import EmployeeForm from '../components/EmployeeForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import { getEmployeeById, updateEmployee } from '../services/employee.service.js';

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, loading, error } = useFetch(() => getEmployeeById(id), [id]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This employee could not be found.' : 'Unable to load this employee right now.'} />
    );
  }

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await updateEmployee(id, values);
      navigate(`/employees/${id}`);
    } catch (err) {
      const message = err.response?.data?.message;
      setServerError(message || 'Unable to save changes right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link to={`/employees/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to employee
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Edit Employee</h1>
      <Card>
        <EmployeeForm
          mode="edit"
          initialValues={{ ...employee, hire_date: String(employee.hire_date).slice(0, 10) }}
          onSubmit={handleSubmit}
          submitting={submitting}
          serverError={serverError}
        />
      </Card>
    </div>
  );
};

export default EditEmployeePage;
