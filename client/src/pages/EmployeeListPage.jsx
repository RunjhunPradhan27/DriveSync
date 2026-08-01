import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCog, Pencil } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllEmployees } from '../services/employee.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

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

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredEmployees, 10);

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message="Unable to load employees right now." />;

  return (
    <div>
      <PageHeader
        icon={UserCog}
        title="Employees"
        description="Dealership staff accounts"
        actions={<LinkButton to="/employees/new">Add Employee</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, designation, or department"
        className="mb-4"
      />

      {(!employees || employees.length === 0) && (
        <EmptyState icon={UserCog} title="No employees yet" description='Click "Add Employee" to create one.' />
      )}

      {employees && employees.length > 0 && filteredEmployees.length === 0 && (
        <EmptyState icon={UserCog} title="No employees match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Designation</th>
              <th className={thClass}>Department</th>
              <th className={thClass}>Salary</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((employee) => (
              <tr key={employee.employee_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/employees/${employee.employee_id}`} className="hover:text-indigo-600">
                    {employee.first_name} {employee.last_name}
                  </Link>
                </td>
                <td className={tdClass}>{employee.email}</td>
                <td className={tdClass}>{employee.designation}</td>
                <td className={tdClass}>{employee.department}</td>
                <td className={tdClass}>{formatCurrency(employee.salary)}</td>
                <td className={tdClass}>
                  <IconLinkButton to={`/employees/${employee.employee_id}/edit`} icon={Pencil} label="Edit employee" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} total={total} pageSize={pageSize} />
    </div>
  );
};

export default EmployeeListPage;
