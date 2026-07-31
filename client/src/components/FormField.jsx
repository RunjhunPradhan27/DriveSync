/**
 * Reusable labeled input with an inline validation-error slot, so forms
 * don't repeat the same label/input/error markup for every field.
 */
const FormField = ({ label, id, error, ...inputProps }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      {...inputProps}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormField;
