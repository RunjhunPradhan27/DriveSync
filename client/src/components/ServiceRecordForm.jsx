import { useMemo, useState } from 'react';
import { FileText, IndianRupee, Calendar } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getAllServiceBookings } from '../services/serviceBooking.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import { getAllEmployees } from '../services/employee.service.js';
import FormField from './FormField.jsx';
import SelectField from './SelectField.jsx';
import Loader from './Loader.jsx';
import Button from './ui/Button.jsx';
import { buildVehicleNameMap } from '../utils/entityMaps.js';

const SERVICE_RECORD_STATUSES = ['Completed', 'Cancelled'];

/**
 * Shared form for creating and editing a service record. The backend allows
 * the exact same field set on create and update, so like the other forms
 * there's no field-set distinction by mode — only the submit button label
 * differs.
 *
 * The employee field is role-conditional: GET /api/employees is Admin-only,
 * so a Technician can't be shown a picker of technician names (that call
 * would 403). Admin gets a proper dropdown; Technician gets a plain numeric
 * field for their own employee ID — mirrors SaleForm's employee_id handling.
 * The booking field has no such split: GET /api/service-bookings is open to
 * both Admin and Technician, so it's always a proper dropdown.
 */
const ServiceRecordForm = ({ initialValues, onSubmit, submitting, serverError, submitLabel }) => {
  const { user } = useAuth();
  const isAdmin = user.role === 'Admin';

  const bookings = useFetch(getAllServiceBookings, []);
  const vehicles = useFetch(getAllVehicles, []);
  const employees = useFetch(isAdmin ? getAllEmployees : () => Promise.resolve([]), [isAdmin]);

  const vehicleMap = useMemo(() => buildVehicleNameMap(vehicles.data), [vehicles.data]);

  const [values, setValues] = useState(() => ({
    booking_id: '',
    employee_id: '',
    work_description: '',
    labour_cost: '',
    parts_cost: 0,
    total_cost: '',
    completion_date: '',
    service_status: 'Completed',
    ...initialValues
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.booking_id) nextErrors.booking_id = 'Service booking is required.';
    if (!values.employee_id) nextErrors.employee_id = 'Technician is required.';
    if (!values.work_description.trim()) nextErrors.work_description = 'Work description is required.';
    if (values.labour_cost === '' || Number(values.labour_cost) < 0) {
      nextErrors.labour_cost = 'Enter a valid labour cost.';
    }
    if (values.parts_cost !== '' && Number(values.parts_cost) < 0) {
      nextErrors.parts_cost = 'Enter a valid parts cost.';
    }
    if (values.total_cost === '' || Number(values.total_cost) < 0) {
      nextErrors.total_cost = 'Enter a valid total cost.';
    }
    if (!values.completion_date) nextErrors.completion_date = 'Completion date is required.';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      booking_id: Number(values.booking_id),
      employee_id: Number(values.employee_id),
      work_description: values.work_description.trim(),
      labour_cost: Number(values.labour_cost),
      parts_cost: values.parts_cost === '' ? 0 : Number(values.parts_cost),
      total_cost: Number(values.total_cost),
      completion_date: values.completion_date,
      service_status: values.service_status
    });
  };

  if (bookings.loading || vehicles.loading || employees.loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <SelectField
        label="Service Booking"
        id="booking_id"
        value={values.booking_id}
        onChange={handleChange('booking_id')}
        error={errors.booking_id}
      >
        <option value="">Select a service booking</option>
        {bookings.data?.map((b) => (
          <option key={b.booking_id} value={b.booking_id}>
            #{b.booking_id} — {b.service_type} — {vehicleMap.get(b.vehicle_id) || `Vehicle #${b.vehicle_id}`} ({String(b.service_date).slice(0, 10)})
          </option>
        ))}
      </SelectField>

      {isAdmin ? (
        <SelectField
          label="Technician"
          id="employee_id"
          value={values.employee_id}
          onChange={handleChange('employee_id')}
          error={errors.employee_id}
        >
          <option value="">Select a technician</option>
          {employees.data?.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.first_name} {e.last_name} ({e.designation})
            </option>
          ))}
        </SelectField>
      ) : (
        <FormField
          label="Your Employee ID"
          id="employee_id"
          type="number"
          value={values.employee_id}
          onChange={handleChange('employee_id')}
          error={errors.employee_id}
        />
      )}

      <FormField
        label="Work Description"
        id="work_description"
        icon={FileText}
        value={values.work_description}
        onChange={handleChange('work_description')}
        error={errors.work_description}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Labour Cost"
          id="labour_cost"
          type="number"
          step="0.01"
          min="0"
          icon={IndianRupee}
          value={values.labour_cost}
          onChange={handleChange('labour_cost')}
          error={errors.labour_cost}
        />

        <FormField
          label="Parts Cost"
          id="parts_cost"
          type="number"
          step="0.01"
          min="0"
          icon={IndianRupee}
          value={values.parts_cost}
          onChange={handleChange('parts_cost')}
          error={errors.parts_cost}
        />

        <FormField
          label="Total Cost"
          id="total_cost"
          type="number"
          step="0.01"
          min="0"
          icon={IndianRupee}
          value={values.total_cost}
          onChange={handleChange('total_cost')}
          error={errors.total_cost}
        />
      </div>

      <FormField
        label="Completion Date"
        id="completion_date"
        type="date"
        icon={Calendar}
        value={values.completion_date}
        onChange={handleChange('completion_date')}
        error={errors.completion_date}
      />

      <SelectField
        label="Service Status"
        id="service_status"
        value={values.service_status}
        onChange={handleChange('service_status')}
      >
        {SERVICE_RECORD_STATUSES.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </SelectField>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={submitting} className="w-full" size="lg">
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
};

export default ServiceRecordForm;
