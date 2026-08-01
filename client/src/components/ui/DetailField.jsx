/**
 * One labeled field in a details-page <dl> grid: an icon chip, a small
 * uppercase label, and the value. Used across every resource's details page.
 */
const DetailField = ({ icon: Icon, label, value, mono = false, className = '' }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
      <Icon className="h-4 w-4" strokeWidth={2} />
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className={`mt-0.5 font-medium text-slate-900 ${mono ? 'font-mono text-sm' : 'text-sm'}`}>{value}</dd>
    </div>
  </div>
);

export default DetailField;
