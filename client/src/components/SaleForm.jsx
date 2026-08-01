import { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { getAllCustomers } from '../services/customer.service.js';
import { getAllVehicles } from '../services/vehicle.service.js';
import { getAllEmployees } from '../services/employee.service.js';
import FormField from './FormField.jsx';
import SelectField from './SelectField.jsx';
import Loader from './Loader.jsx';

const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Loan'];
const SALE_STATUSES = ['Pending', 'Completed', 'Cancelled'];

/**
 * Shared form for creating and editing a sale. The backend allows the exact
 * same field set on create and update, so unlike CustomerForm there's no
 * field-set distinction by mode — only the submit button label differs.
 *
 * The employee field is role-conditional: GET /api/employees is Admin-only,
 * so a Sales Executive can't be shown a picker of salesperson names (that
 * call would 403). Admin gets a proper dropdown; Sales Executive gets a
 * plain numeric field for their own employee ID — a real constraint from
 * the existing backend RBAC, not an oversight.
 */
const SaleForm = ({ initialValues, onSubmit, submitting, serverError, submitLabel }) => {
  const { user } = useAuth();
  const isAdmin = user.role === 'Admin';

  const customers = useFetch(getAllCustomers, []);
  const vehicles = useFetch(getAllVehicles, []);
  const employees = useFetch(isAdmin ? getAllEmployees : () => Promise.resolve([]), [isAdmin]);

  const [values, setValues] = useState(() => ({
    customer_id: '',
    vehicle_id: '',
    employee_id: '',
    sale_date: '',
    sale_price: '',
    payment_method: '',
    sale_status: 'Pending',
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
    if (!values.employee_id) nextErrors.employee_id = 'Employee is required.';
    if (!values.sale_date) nextErrors.sale_date = 'Sale date is required.';
    if (values.sale_price === '' || Number(values.sale_price) <= 0) {
      nextErrors.sale_price = 'Enter a valid sale price.';
    }
    if (!values.payment_method) nextErrors.payment_method = 'Payment method is required.';
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
      employee_id: Number(values.employee_id),
      sale_date: values.sale_date,
      sale_price: Number(values.sale_price),
      payment_method: values.payment_method,
      sale_status: values.sale_status
    });
  };

  if (customers.loading || vehicles.loading || employees.loading) return <Loader />;

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

      {isAdmin ? (
        <SelectField
          label="Sales Employee"
          id="employee_id"
          value={values.employee_id}
          onChange={handleChange('employee_id')}
          error={errors.employee_id}
        >
          <option value="">Select an employee</option>
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
        label="Sale Date"
        id="sale_date"
        type="date"
        value={values.sale_date}
        onChange={handleChange('sale_date')}
        error={errors.sale_date}
      />

      <FormField
        label="Sale Price"
        id="sale_price"
        type="number"
        step="0.01"
        min="0"
        value={values.sale_price}
        onChange={handleChange('sale_price')}
        error={errors.sale_price}
      />

      <SelectField
        label="Payment Method"
        id="payment_method"
        value={values.payment_method}
        onChange={handleChange('payment_method')}
        error={errors.payment_method}
      >
        <option value="">Select a payment method</option>
        {PAYMENT_METHODS.map((method) => (
          <option key={method} value={method}>{method}</option>
        ))}
      </SelectField>

      <SelectField
        label="Sale Status"
        id="sale_status"
        value={values.sale_status}
        onChange={handleChange('sale_status')}
      >
        {SALE_STATUSES.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </SelectField>

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

export default SaleForm;
