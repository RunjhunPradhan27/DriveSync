import { useMemo, useState } from 'react';
import { Car } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import usePagination from '../hooks/usePagination.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import VehicleCard from '../components/VehicleCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const VehicleListPage = () => {
  const { data: vehicles, loading, error } = useFetch(getAllVehicles, []);
  const [searchTerm, setSearchTerm] = useState('');

  // No server-side search exists on GET /vehicles, so — matching every other
  // list page in the app — this filters the already-fetched list client-side.
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return vehicles;
    return vehicles.filter(
      (vehicle) =>
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(term) ||
        vehicle.fuel_type.toLowerCase().includes(term) ||
        vehicle.transmission.toLowerCase().includes(term)
    );
  }, [vehicles, searchTerm]);

  const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(filteredVehicles, 9);

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message="Unable to load vehicles right now." />;

  return (
    <div>
      <PageHeader
        icon={Car}
        title="Available Vehicles"
        description="Browse the current dealership inventory"
      />

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by make, model, fuel type, or transmission"
        className="mb-6"
      />

      {(!vehicles || vehicles.length === 0) && (
        <EmptyState
          icon={Car}
          title="No vehicles available"
          description="Check back soon — new inventory is added regularly."
        />
      )}

      {vehicles && vehicles.length > 0 && filteredVehicles.length === 0 && (
        <EmptyState icon={Car} title="No vehicles match your search" description="Try a different make, model, or spec." />
      )}

      {pageItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((vehicle) => (
              <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
            ))}
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} total={total} pageSize={pageSize} />
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleListPage;
