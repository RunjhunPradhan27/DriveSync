import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getAllSpareParts } from '../services/spareParts.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';

const SparePartsListPage = () => {
  const { user } = useAuth();
  const canManage = user.role === 'Admin' || user.role === 'Inventory Manager';

  const spareParts = useFetch(getAllSpareParts, []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParts = useMemo(() => {
    if (!spareParts.data) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return spareParts.data;
    return spareParts.data.filter(
      (part) =>
        part.part_name.toLowerCase().includes(term) ||
        part.part_number.toLowerCase().includes(term) ||
        part.supplier_name.toLowerCase().includes(term)
    );
  }, [spareParts.data, searchTerm]);

  if (spareParts.loading) return <Loader />;
  if (spareParts.error) return <ErrorBanner message="Unable to load spare parts right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Spare Parts</h1>
        {canManage && (
          <Link
            to="/spare-parts/new"
            className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
          >
            Add Spare Part
          </Link>
        )}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by part name, part number, or supplier"
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!spareParts.data || spareParts.data.length === 0) && (
        <p className="text-gray-500">
          No spare parts yet.{canManage ? ' Click "Add Spare Part" to create one.' : ''}
        </p>
      )}

      {spareParts.data && spareParts.data.length > 0 && filteredParts.length === 0 && (
        <p className="text-gray-500">No spare parts match your search.</p>
      )}

      {filteredParts.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Part Name</th>
                <th className="px-4 py-3 font-medium">Part Number</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Unit Price</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                {canManage && <th className="px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParts.map((part) => (
                <tr key={part.part_id}>
                  <td className="px-4 py-3">
                    <Link to={`/spare-parts/${part.part_id}`} className="font-medium text-gray-900 hover:underline">
                      {part.part_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{part.part_number}</td>
                  <td className="px-4 py-3 text-gray-700">{part.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(part.unit_price)}</td>
                  <td className="px-4 py-3 text-gray-700">{part.supplier_name}</td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <Link to={`/spare-parts/${part.part_id}/edit`} className="text-gray-600 hover:text-gray-900">
                        Edit
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SparePartsListPage;
