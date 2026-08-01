import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Car, Fuel, Cog, Palette, Hash } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getVehicleById } from '../services/vehicle.service.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import Card from '../components/ui/Card.jsx';
import DetailField from '../components/ui/DetailField.jsx';
import { formatCurrency } from '../utils/formatters.js';

const SPECS = [
  { key: 'fuel_type', label: 'Fuel Type', icon: Fuel },
  { key: 'transmission', label: 'Transmission', icon: Cog },
  { key: 'color', label: 'Color', icon: Palette, fallback: '—' },
  { key: 'vin', label: 'VIN', icon: Hash, mono: true }
];

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
    <div className="max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to vehicles
      </Link>

      <Card padded={false} className="mt-4 overflow-hidden">
        <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 sm:h-64">
          <Car className="h-28 w-28 text-slate-300" strokeWidth={1.1} />
          <span className="absolute left-4 top-4 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur">
            {vehicle.make}
          </span>
          <div className="absolute right-4 top-4">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">{vehicle.model_year} model year</p>
            </div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">{formatCurrency(vehicle.price)}</p>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
            {SPECS.map(({ key, label, icon, fallback, mono }) => (
              <DetailField key={key} icon={icon} label={label} value={vehicle[key] || fallback} mono={mono} />
            ))}
          </dl>
        </div>
      </Card>
    </div>
  );
};

export default VehicleDetailsPage;
