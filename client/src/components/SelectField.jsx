import { ChevronDown } from 'lucide-react';

/**
 * Reusable labeled select with an inline validation-error slot, matching
 * FormField's visual style. Same `label`/`id`/`error`/`children` props
 * (plus passthrough `...selectProps`) and default export as before.
 */
const SelectField = ({ label, id, error, children, className = '', ...selectProps }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        className={[
          'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
          className
        ].join(' ')}
        {...selectProps}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
    </div>
    {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
  </div>
);

export default SelectField;
