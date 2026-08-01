/**
 * Standard page header used at the top of every list/details page: an
 * optional icon, title, optional subtitle/description, and a right-aligned
 * actions slot (buttons, links). Replaces the ad-hoc
 * `<div className="flex items-center justify-between mb-6">` markup that
 * used to be repeated on every page.
 */
const PageHeader = ({ icon: Icon, title, description, actions, className = '' }) => (
  <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
    <div className="flex items-center gap-3">
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
      )}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
