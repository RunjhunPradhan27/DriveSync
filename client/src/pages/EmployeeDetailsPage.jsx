import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase, Building2, Calendar, IndianRupee } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getEmployeeById, deleteEmployee } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import DetailField from '../components/ui/DetailField.jsx';
import { formatCurrency } from '../utils/formatters.js';

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, loading, error } = useFetch(() => getEmployeeById(id), [id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner message={notFound ? 'This employee could not be found.' : 'Unable to load this employee right now.'} />
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${employee.first_name} ${employee.last_name}? This cannot be undone.`);
    if (!confirmed) return;

    setDeleteError('');
    setDeleting(true);
    try {
      await deleteEmployee(id);
      navigate('/employees');
    } catch (err) {
      // A 409 here means the employee has existing sales or service records
      // referencing them (RESTRICT foreign key) — surface the backend's own message.
      const message = err.response?.data?.message;
      setDeleteError(message || 'Unable to delete this employee right now.');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/employees" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to employees
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {employee.first_name} {employee.last_name}
          </h1>
          <div className="flex gap-2">
            <LinkButton to={`/employees/${id}/edit`} variant="secondary" size="sm">
              Edit
            </LinkButton>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>

        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}

        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <DetailField icon={Mail} label="Email" value={employee.email} />
          <DetailField icon={Phone} label="Phone" value={employee.phone} />
          <DetailField icon={Briefcase} label="Designation" value={employee.designation} />
          <DetailField icon={Building2} label="Department" value={employee.department} />
          <DetailField icon={Calendar} label="Hire Date" value={String(employee.hire_date).slice(0, 10)} />
          <DetailField icon={IndianRupee} label="Salary" value={formatCurrency(employee.salary)} />
        </dl>
      </Card>
    </div>
  );
};

export default EmployeeDetailsPage;
