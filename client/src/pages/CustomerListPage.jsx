import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getAllCustomers } from '../services/customer.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

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

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message="Unable to load customers right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Link
          to="/customers/new"
          className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Add Customer
        </Link>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, or phone"
        className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!customers || customers.length === 0) && (
        <p className="text-gray-500">No customers yet. Click "Add Customer" to create one.</p>
      )}

      {customers && customers.length > 0 && filteredCustomers.length === 0 && (
        <p className="text-gray-500">No customers match your search.</p>
      )}

      {filteredCustomers.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td className="px-4 py-3">
                    <Link
                      to={`/customers/${customer.customer_id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {customer.first_name} {customer.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-700">{customer.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{customer.city || '—'}</td>
                  <td className="px-4 py-3">
                    <Link to={`/customers/${customer.customer_id}/edit`} className="text-gray-600 hover:text-gray-900">
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

export default CustomerListPage;
