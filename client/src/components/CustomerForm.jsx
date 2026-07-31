import { useState } from 'react';
import FormField from './FormField.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared form for both creating and editing a customer. In 'create' mode it
 * also collects the account fields (username/email/password) needed to
 * provision the linked login; in 'edit' mode only the profile fields are
 * shown/submitted, matching what the backend's PUT /customers/:id accepts
 * (email/username/password are intentionally not editable there).
 */
const CustomerForm = ({ mode, initialValues, onSubmit, submitting, serverError }) => {
  const [values, setValues] = useState(() => ({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    ...initialValues
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (mode === 'create') {
      if (!values.username.trim()) nextErrors.username = 'Username is required.';
      if (!values.email.trim()) nextErrors.email = 'Email is required.';
      else if (!EMAIL_PATTERN.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
      if (!values.password) nextErrors.password = 'Password is required.';
    }

    if (!values.first_name.trim()) nextErrors.first_name = 'First name is required.';
    if (!values.last_name.trim()) nextErrors.last_name = 'Last name is required.';
    if (!values.phone.trim()) nextErrors.phone = 'Phone is required.';

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (mode === 'create') {
      onSubmit(values);
    } else {
      const { first_name, last_name, phone, address, city } = values;
      onSubmit({ first_name, last_name, phone, address, city });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {mode === 'create' && (
        <>
          <FormField label="Username" id="username" value={values.username} onChange={handleChange('username')} error={errors.username} />
          <FormField label="Email" id="email" type="email" value={values.email} onChange={handleChange('email')} error={errors.email} />
          <FormField label="Password" id="password" type="password" value={values.password} onChange={handleChange('password')} error={errors.password} />
        </>
      )}

      <FormField label="First Name" id="first_name" value={values.first_name} onChange={handleChange('first_name')} error={errors.first_name} />
      <FormField label="Last Name" id="last_name" value={values.last_name} onChange={handleChange('last_name')} error={errors.last_name} />
      <FormField label="Phone" id="phone" value={values.phone} onChange={handleChange('phone')} error={errors.phone} />
      <FormField label="Address (optional)" id="address" value={values.address} onChange={handleChange('address')} />
      <FormField label="City (optional)" id="city" value={values.city} onChange={handleChange('city')} />

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving…' : mode === 'create' ? 'Add Customer' : 'Save Changes'}
      </button>
    </form>
  );
};

export default CustomerForm;
