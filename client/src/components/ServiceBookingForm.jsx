import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { getAllCustomers } from '../services/customer.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import FormField from './FormField.jsx';
import SelectField from './SelectField.jsx';
import Loader from './Loader.jsx';

const SERVICE_STATUSES = ['Pending', 'In_Progress', 'Completed', 'Cancelled'];

/**
 * Shared form for creating and editing a service booking. The backend
 * allows the exact same field set on create and update, so like
 * SaleForm/InventoryForm there's no field-set distinction by mode — only
 * the submit button label differs.
 *
 * Both customer_id and vehicle_id are pickers backed by list endpoints.
 * Unlike SaleForm's employee picker, no role-conditional fallback is needed
 * here: GET /api/customers is Admin/Sales-Executive-only, but so is write
 * access to bookings (POST/PUT), so every role that can reach this form can
 * also load the customer picker.
 */
const ServiceBookingForm = ({ initialValues, onSubmit, submitting, serverError, submitLabel }) => {
  const customers = useFetch(getAllCustomers, []);
  const vehicles = useFetch(getAllVehicles, []);

  const [values, setValues] = useState(() => ({
    customer_id: '',
    vehicle_id: '',
    service_date: '',
    service_type: '',
    service_status: 'Pending',
    remarks: '',
    ...initialValues
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.customer_id) nextErrors.customer_id = 'Customer is required.';
    if (!values.vehicle_id) nextErrors.vehicle_id = 'Vehicle is required.';
    if (!values.service_date) nextErrors.service_date = 'Service date is required.';
    if (!values.service_type.trim()) nextErrors.service_type = 'Service type is required.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      customer_id: Number(values.customer_id),
      vehicle_id: Number(values.vehicle_id),
      service_date: values.service_date,
      service_type: values.service_type.trim(),
      service_status: values.service_status,
      remarks: values.remarks.trim() || null
    });
  };

  if (customers.loading || vehicles.loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <SelectField
        label="Customer"
        id="customer_id"
        value={values.customer_id}
        onChange={handleChange('customer_id')}
        error={errors.customer_id}
      >
        <option value="">Select a customer</option>
        {customers.data?.map((c) => (
          <option key={c.customer_id} value={c.customer_id}>
            {c.first_name} {c.last_name} ({c.email})
          </option>
        ))}
      </SelectField>

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

      <FormField
        label="Service Date"
        id="service_date"
        type="date"
        value={values.service_date}
        onChange={handleChange('service_date')}
        error={errors.service_date}
      />

      <FormField
        label="Service Type"
        id="service_type"
        placeholder="e.g. Oil Change, Brake Inspection"
        value={values.service_type}
        onChange={handleChange('service_type')}
        error={errors.service_type}
      />

      <SelectField
        label="Service Status"
        id="service_status"
        value={values.service_status}
        onChange={handleChange('service_status')}
        error={errors.service_status}
      >
        {SERVICE_STATUSES.map((status) => (
          <option key={status} value={status}>{status.replace('_', ' ')}</option>
        ))}
      </SelectField>

      <FormField
        label="Remarks (optional)"
        id="remarks"
        value={values.remarks}
        onChange={handleChange('remarks')}
      />

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
};

export default ServiceBookingForm;
