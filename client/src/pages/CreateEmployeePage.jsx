import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm.jsx';
import Card from '../components/ui/Card.jsx';
import { createEmployee } from '../services/employee.service.js';

const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const created = await createEmployee(values);
      navigate(`/employees/${created.employee_id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to create employee right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Link to="/employees" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to employees
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Add Employee</h1>
      <Card>
        <EmployeeForm mode="create" onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
      </Card>
    </div>
  );
};

export default CreateEmployeePage;
