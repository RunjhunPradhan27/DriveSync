import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Pencil } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllInventory } from '../services/inventory.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { buildVehicleNameMap } from '../utils/entityMaps.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import LinkButton from '../components/ui/LinkButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { IconLinkButton } from '../components/ui/IconButton.jsx';
import Table, { theadClass, thClass, tbodyClass, trClass, tdClass, tdEmphasisClass } from '../components/ui/Table.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const InventoryListPage = () => {
  const inventory = useFetch(getAllInventory, []);
  const vehicles = useFetch(getAllVehicles, []);

  const [searchTerm, setSearchTerm] = useState('');

  const vehicleMap = useMemo(() => buildVehicleNameMap(vehicles.data), [vehicles.data]);

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

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredInventory, 10);

  if (inventory.loading || vehicles.loading) return <Loader />;
  if (inventory.error) return <ErrorBanner message="Unable to load inventory right now." />;

  return (
    <div>
      <PageHeader
        icon={Boxes}
        title="Inventory"
        description="Vehicle stock levels by location"
        actions={<LinkButton to="/inventory/new">Add Stock Record</LinkButton>}
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by vehicle, location, or stock status"
        className="mb-4"
      />

      {(!inventory.data || inventory.data.length === 0) && (
        <EmptyState icon={Boxes} title="No inventory records yet" description='Click "Add Stock Record" to create one.' />
      )}

      {inventory.data && inventory.data.length > 0 && filteredInventory.length === 0 && (
        <EmptyState icon={Boxes} title="No inventory records match your search" />
      )}

      {pageItems.length > 0 && (
        <Table>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Vehicle</th>
              <th className={thClass}>Quantity</th>
              <th className={thClass}>Stock Status</th>
              <th className={thClass}>Location</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageItems.map((record) => (
              <tr key={record.inventory_id} className={trClass}>
                <td className={tdEmphasisClass}>
                  <Link to={`/inventory/${record.inventory_id}`} className="hover:text-indigo-600">
                    {record.vehicleName}
                  </Link>
                </td>
                <td className={tdClass}>{record.quantity}</td>
                <td className={tdClass}>
                  <StatusBadge status={record.stock_status} />
                </td>
                <td className={tdClass}>{record.storage_location}</td>
                <td className={tdClass}>
                  <IconLinkButton to={`/inventory/${record.inventory_id}/edit`} icon={Pencil} label="Edit inventory record" />
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

export default InventoryListPage;
