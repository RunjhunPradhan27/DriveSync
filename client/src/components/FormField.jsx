/**
 * Reusable labeled input with an inline validation-error slot. Same
 * `label`/`id`/`error` props (plus passthrough `...inputProps`) and default
 * export as before — every form using it renders unchanged, just restyled.
 * `icon` is an optional new prop (a lucide icon component) for pages that
 * want a leading icon; omitting it renders exactly as plain forms did.
 */
const FormField = ({ label, id, error, className = '', icon: Icon, ...inputProps }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />}
      <input
        id={id}
        className={[
          'w-full rounded-lg border bg-white py-2.5 text-sm text-slate-900 shadow-sm transition-colors',
          Icon ? 'pl-9 pr-3.5' : 'px-3.5',
          'placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
          className
        ].join(' ')}
        {...inputProps}
      />
    </div>
    {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormField;
