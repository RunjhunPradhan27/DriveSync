// Tailwind's scanner only picks up class names it can see literally in
// source, so accent variants must be spelled out here rather than built via
// template-literal interpolation (`bg-${accent}-50` would silently produce
// no styles at build time).
const ACCENT_STYLES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600'
};

/**
 * KPI summary card: a label, a big number, and its own inline loading/error
 * state so each card resolves independently of the others. Same
 * `label`/`value`/`loading`/`error` props as before; `icon` and `accent` are
 * optional additions that default to the plain look when omitted, so
 * existing call sites keep working unchanged.
 */
const DashboardCard = ({ label, value, loading, error, icon: Icon, accent = 'indigo' }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ACCENT_STYLES[accent] || ACCENT_STYLES.indigo}`}>
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-3 h-8 w-20 animate-pulse rounded-md bg-slate-100" />
      ) : error ? (
        <p className="mt-2 text-3xl font-bold text-slate-300" title="Unable to load this figure">
          &mdash;
        </p>
      ) : (
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value ?? 0}</p>
      )}
    </div>
  );
};

export default DashboardCard;
