/**
 * Standard "nothing here yet" / "no results" placeholder used across every
 * list page, in place of a bare <p className="text-gray-500">.
 */
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-16 text-center">
    {Icon && (
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
    )}
    <p className="text-sm font-medium text-slate-700">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
