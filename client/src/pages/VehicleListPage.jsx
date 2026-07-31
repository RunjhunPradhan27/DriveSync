import useFetch from '../hooks/useFetch.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import VehicleCard from '../components/VehicleCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

const VehicleListPage = () => {
  const { data: vehicles, loading, error } = useFetch(getAllVehicles, []);

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message="Unable to load vehicles right now." />;

  if (!vehicles || vehicles.length === 0) {
    return <p className="text-gray-500">No vehicles available at the moment.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Vehicles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default VehicleListPage;
