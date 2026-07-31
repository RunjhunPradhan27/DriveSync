import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getVehicleById } from '../services/vehicle.service.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatCurrency } from '../utils/formatters.js';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const { data: vehicle, loading, error } = useFetch(() => getVehicleById(id), [id]);

  if (loading) return <Loader />;

  if (error) {
    const notFound = error.response?.status === 404;
    return (
      <ErrorBanner
        message={notFound ? 'This vehicle could not be found.' : 'Unable to load vehicle details right now.'}
      />
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to vehicles
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.make} {vehicle.model} ({vehicle.model_year})
          </h1>
          <StatusBadge status={vehicle.status} />
        </div>

        <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(vehicle.price)}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Fuel Type</dt>
            <dd className="font-medium text-gray-900">{vehicle.fuel_type}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Transmission</dt>
            <dd className="font-medium text-gray-900">{vehicle.transmission}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Color</dt>
            <dd className="font-medium text-gray-900">{vehicle.color || '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">VIN</dt>
            <dd className="font-medium text-gray-900">{vehicle.vin}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
