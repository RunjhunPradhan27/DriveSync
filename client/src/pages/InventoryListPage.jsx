import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getAllInventory } from '../services/inventory.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const InventoryListPage = () => {
  const inventory = useFetch(getAllInventory, []);
  const vehicles = useFetch(getAllVehicles, []);

  const [searchTerm, setSearchTerm] = useState('');

  const vehicleMap = useMemo(
    () => new Map((vehicles.data || []).map((v) => [v.vehicle_id, `${v.make} ${v.model}`])),
    [vehicles.data]
  );

  const enrichedInventory = useMemo(() => {
    if (!inventory.data) return [];
    return inventory.data.map((record) => ({
      ...record,
      vehicleName: vehicleMap.get(record.vehicle_id) || `Vehicle #${record.vehicle_id}`
    }));
  }, [inventory.data, vehicleMap]);

  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return enrichedInventory;
    return enrichedInventory.filter(
      (record) =>
        record.vehicleName.toLowerCase().includes(term) ||
        record.storage_location.toLowerCase().includes(term) ||
        record.stock_status.toLowerCase().includes(term)
    );
  }, [enrichedInventory, searchTerm]);

  if (inventory.loading || vehicles.loading) return <Loader />;
  if (inventory.error) return <ErrorBanner message="Unable to load inventory right now." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <Link
          to="/inventory/new"
          className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Add Stock Record
        </Link>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by vehicle, location, or stock status"
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {(!inventory.data || inventory.data.length === 0) && (
        <p className="text-gray-500">No inventory records yet. Click "Add Stock Record" to create one.</p>
      )}

      {inventory.data && inventory.data.length > 0 && filteredInventory.length === 0 && (
        <p className="text-gray-500">No inventory records match your search.</p>
      )}

      {filteredInventory.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Stock Status</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((record) => (
                <tr key={record.inventory_id}>
                  <td className="px-4 py-3">
                    <Link to={`/inventory/${record.inventory_id}`} className="font-medium text-gray-900 hover:underline">
                      {record.vehicleName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{record.quantity}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={record.stock_status} />
                  </td>
                  <td className="px-4 py-3 text-gray-700">{record.storage_location}</td>
                  <td className="px-4 py-3">
                    <Link to={`/inventory/${record.inventory_id}/edit`} className="text-gray-600 hover:text-gray-900">
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

export default InventoryListPage;
