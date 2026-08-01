import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Pencil } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllCustomers } from '../services/customer.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const CustomerListPage = () => {
  const { data: customers, loading, error } = useFetch(getAllCustomers, []);
  const [searchTerm, setSearchTerm] = useState('');

  // No server-side search/filter exists on GET /customers, so this filters
  // the already-fetched list client-side rather than adding a backend query param.
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (customer) =>
        `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term)
    );
  }, [customers, searchTerm]);

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredCustomers, 10);

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message="Unable to load customers right now." />;

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Customers"
        description="Everyone registered with the dealership"
        actions={<LinkButton to="/customers/new">Add Customer</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, or phone"
        className="mb-4"
      />

      {(!customers || customers.length === 0) && (
        <EmptyState icon={Users} title="No customers yet" description='Click "Add Customer" to create one.' />
      )}

      {customers && customers.length > 0 && filteredCustomers.length === 0 && (
        <EmptyState icon={Users} title="No customers match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Phone</th>
              <th className={thClass}>City</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((customer) => (
              <tr key={customer.customer_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/customers/${customer.customer_id}`} className="hover:text-indigo-600">
                    {customer.first_name} {customer.last_name}
                  </Link>
                </td>
                <td className={tdClass}>{customer.email}</td>
                <td className={tdClass}>{customer.phone}</td>
                <td className={tdClass}>{customer.city || '—'}</td>
                <td className={tdClass}>
                  <IconLinkButton to={`/customers/${customer.customer_id}/edit`} icon={Pencil} label="Edit customer" />
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

export default CustomerListPage;
