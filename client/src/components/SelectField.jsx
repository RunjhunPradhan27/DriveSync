/**
 * Reusable labeled select with an inline validation-error slot, matching
 * FormField's visual style for dropdown-style inputs.
 */
const SelectField = ({ label, id, error, children, ...selectProps }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      {...selectProps}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default SelectField;
