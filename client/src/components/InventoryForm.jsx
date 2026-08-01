import { useState } from 'react';
import { Layers, MapPin } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import FormField from './FormField.jsx';
import SelectField from './SelectField.jsx';
import Loader from './Loader.jsx';
import Button from './ui/Button.jsx';

const STOCK_STATUSES = ['In Stock', 'Low Stock', 'Out of Stock'];

/**
 * Shared form for creating and editing an inventory stock record. The
 * backend allows the exact same field set on create and update, so like
 * SaleForm there's no field-set distinction by mode — only the submit
 * button label differs.
 */
const InventoryForm = ({ initialValues, onSubmit, submitting, serverError, submitLabel }) => {
  const vehicles = useFetch(getAllVehicles, []);

  const [values, setValues] = useState(() => ({
    vehicle_id: '',
    quantity: 0,
    stock_status: 'In Stock',
    storage_location: '',
    ...initialValues
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.vehicle_id) nextErrors.vehicle_id = 'Vehicle is required.';
    if (values.quantity === '' || Number(values.quantity) < 0) {
      nextErrors.quantity = 'Enter a valid quantity.';
    }
    if (!values.storage_location.trim()) nextErrors.storage_location = 'Storage location is required.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      vehicle_id: Number(values.vehicle_id),
      quantity: Number(values.quantity),
      stock_status: values.stock_status,
      storage_location: values.storage_location.trim()
    });
  };

  if (vehicles.loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <SelectField
        label="Vehicle"
        id="vehicle_id"
        value={values.vehicle_id}
        onChange={handleChange('vehicle_id')}
        error={errors.vehicle_id}
      >
        <option value="">Select a vehicle</option>
        {vehicles.data?.map((v) => (
          <option key={v.vehicle_id} value={v.vehicle_id}>
            {v.make} {v.model} ({v.vin})
          </option>
        ))}
      </SelectField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Quantity"
          id="quantity"
          type="number"
          min="0"
          icon={Layers}
          value={values.quantity}
          onChange={handleChange('quantity')}
          error={errors.quantity}
        />

        <SelectField
          label="Stock Status"
          id="stock_status"
          value={values.stock_status}
          onChange={handleChange('stock_status')}
          error={errors.stock_status}
        >
          {STOCK_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </SelectField>
      </div>

      <FormField
        label="Storage Location"
        id="storage_location"
        icon={MapPin}
        value={values.storage_location}
        onChange={handleChange('storage_location')}
        error={errors.storage_location}
      />

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={submitting} className="w-full" size="lg">
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
};

export default InventoryForm;
