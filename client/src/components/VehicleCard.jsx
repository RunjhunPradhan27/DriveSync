import { Link } from 'react-router-dom';
import { Car, Calendar, Fuel, Cog } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatCurrency } from '../utils/formatters.js';

/**
 * Vehicle listing card. Same `vehicle` prop shape and destination as before
 * — only the visual treatment changed. No real vehicle photos are available
 * from the backend, so the "image" area is a styled placeholder (gradient +
 * vehicle icon) rather than a fetched/external image.
 */
const VehicleCard = ({ vehicle }) => {
  return (
    <Link
      to={`/vehicles/${vehicle.vehicle_id}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50">
        <Car className="h-20 w-20 text-slate-300 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.25} />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur">
          {vehicle.make}
        </span>
        <div className="absolute right-3 top-3">
          <StatusBadge status={vehicle.status} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
          {vehicle.make} {vehicle.model}
        </h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
            <Calendar className="h-3 w-3" strokeWidth={2} /> {vehicle.model_year}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
            <Fuel className="h-3 w-3" strokeWidth={2} /> {vehicle.fuel_type}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
            <Cog className="h-3 w-3" strokeWidth={2} /> {vehicle.transmission}
          </span>
        </div>

        <p className="mt-3 border-t border-slate-100 pt-3 text-lg font-bold text-slate-900">
          {formatCurrency(vehicle.price)}
        </p>
      </div>
    </Link>
  );
};

export default VehicleCard;
