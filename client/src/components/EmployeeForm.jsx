import { useState } from 'react';
import FormField from './FormField.jsx';
import SelectField from './SelectField.jsx';
import { EMAIL_PATTERN } from '../utils/validators.js';

// Roles an Admin may assign when provisioning an employee account — mirrors
// ALLOWED_EMPLOYEE_ROLES in employee.controller.js exactly ('Customer' is
// never assignable here, matching the backend's own exclusion).
const ALLOWED_EMPLOYEE_ROLES = ['Admin', 'Sales Executive', 'Technician', 'Inventory Manager'];

/**
 * Shared form for both creating and editing an employee, mirroring
 * CustomerForm's mode-based field split. In 'create' mode it also collects
 * the account fields (username/email/password/role) needed to provision the
 * linked login; in 'edit' mode only the profile fields are shown/submitted,
 * matching what the backend's PUT /employees/:id accepts (email/role are
 * intentionally not editable there — role is account/RBAC, not profile).
 */
const EmployeeForm = ({ mode, initialValues, onSubmit, submitting, serverError }) => {
  const [values, setValues] = useState(() => ({
    username: '',
    email: '',
    password: '',
    role: '',
    first_name: '',
    last_name: '',
    phone: '',
    designation: '',
    department: '',
    hire_date: '',
    salary: '',
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
      if (!values.role) nextErrors.role = 'Role is required.';
    }

    if (!values.first_name.trim()) nextErrors.first_name = 'First name is required.';
    if (!values.last_name.trim()) nextErrors.last_name = 'Last name is required.';
    if (!values.phone.trim()) nextErrors.phone = 'Phone is required.';
    if (!values.designation.trim()) nextErrors.designation = 'Designation is required.';
    if (!values.department.trim()) nextErrors.department = 'Department is required.';
    if (!values.hire_date) nextErrors.hire_date = 'Hire date is required.';
    if (values.salary === '' || Number(values.salary) < 0) {
      nextErrors.salary = 'Enter a valid salary.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const { first_name, last_name, phone, designation, department, hire_date, salary } = values;
    const profileFields = { first_name, last_name, phone, designation, department, hire_date, salary: Number(salary) };

    if (mode === 'create') {
      const { username, email, password, role } = values;
      onSubmit({ username, email, password, role, ...profileFields });
    } else {
      onSubmit(profileFields);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {mode === 'create' && (
        <>
          <FormField label="Username" id="username" value={values.username} onChange={handleChange('username')} error={errors.username} />
          <FormField label="Email" id="email" type="email" value={values.email} onChange={handleChange('email')} error={errors.email} />
          <FormField label="Password" id="password" type="password" value={values.password} onChange={handleChange('password')} error={errors.password} />
          <SelectField label="Role" id="role" value={values.role} onChange={handleChange('role')} error={errors.role}>
            <option value="">Select a role</option>
            {ALLOWED_EMPLOYEE_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </SelectField>
        </>
      )}

      <FormField label="First Name" id="first_name" value={values.first_name} onChange={handleChange('first_name')} error={errors.first_name} />
      <FormField label="Last Name" id="last_name" value={values.last_name} onChange={handleChange('last_name')} error={errors.last_name} />
      <FormField label="Phone" id="phone" value={values.phone} onChange={handleChange('phone')} error={errors.phone} />
      <FormField label="Designation" id="designation" value={values.designation} onChange={handleChange('designation')} error={errors.designation} />
      <FormField label="Department" id="department" value={values.department} onChange={handleChange('department')} error={errors.department} />
      <FormField label="Hire Date" id="hire_date" type="date" value={values.hire_date} onChange={handleChange('hire_date')} error={errors.hire_date} />
      <FormField label="Salary" id="salary" type="number" step="0.01" min="0" value={values.salary} onChange={handleChange('salary')} error={errors.salary} />

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving…' : mode === 'create' ? 'Add Employee' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EmployeeForm;
