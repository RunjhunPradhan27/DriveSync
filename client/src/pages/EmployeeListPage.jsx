import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getAllEmployees } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';

const EmployeeListPage = () => {
  const { data: employees, loading, error } = useFetch(getAllEmployees, []);
  const [searchTerm, setSearchTerm] = useState('');

  // No server-side search/filter exists on GET /employees, so this filters
  // the already-fetched list client-side, matching CustomerListPage.
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter(
      (employee) =>
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.designation.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message="Unable to load employees right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <Link
          to="/employees/new"
          className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Add Employee
        </Link>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, designation, or department"
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!employees || employees.length === 0) && (
        <p className="text-gray-500">No employees yet. Click "Add Employee" to create one.</p>
      )}

      {employees && employees.length > 0 && filteredEmployees.length === 0 && (
        <p className="text-gray-500">No employees match your search.</p>
      )}

      {filteredEmployees.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Salary</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td className="px-4 py-3">
                    <Link
                      to={`/employees/${employee.employee_id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {employee.first_name} {employee.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{employee.email}</td>
                  <td className="px-4 py-3 text-gray-700">{employee.designation}</td>
                  <td className="px-4 py-3 text-gray-700">{employee.department}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(employee.salary)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/employees/${employee.employee_id}/edit`} className="text-gray-600 hover:text-gray-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
