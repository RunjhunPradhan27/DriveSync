import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import { formatCurrency } from '../utils/formatters.js';

const VehicleCard = ({ vehicle }) => {
  return (
    <Link
      to={`/vehicles/${vehicle.vehicle_id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500">
            {vehicle.model_year} &middot; {vehicle.fuel_type} &middot; {vehicle.transmission}
          </p>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>
      <p className="mt-3 text-lg font-bold text-gray-900">{formatCurrency(vehicle.price)}</p>
    </Link>
  );
};

export default VehicleCard;
