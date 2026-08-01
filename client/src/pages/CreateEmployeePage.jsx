import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm.jsx';
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
    <div className="max-w-md">
      <Link to="/employees" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to employees
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Add Employee</h1>
      <EmployeeForm mode="create" onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
    </div>
  );
};

export default CreateEmployeePage;
