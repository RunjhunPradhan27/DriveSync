// Each status maps to a semantic "tone" (not raw classes) so the palette
// stays centralized and consistent across every status value in the app.
const STATUS_TONES = {
  Available: 'success',
  Reserved: 'warning',
  Sold: 'neutral',
  In_Maintenance: 'danger',
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'danger',
  Pending: 'warning',
  In_Progress: 'info',
  Completed: 'success',
  Cancelled: 'neutral'
};

const TONE_STYLES = {
  success: { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  warning: { pill: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500' },
  danger: { pill: 'bg-red-50 text-red-700 ring-red-600/10', dot: 'bg-red-500' },
  info: { pill: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500' },
  neutral: { pill: 'bg-slate-100 text-slate-600 ring-slate-500/10', dot: 'bg-slate-400' }
};

/**
 * Status pill with a colored dot indicator. Same `status` prop and default
 * export as before — every call site renders unchanged.
 */
const StatusBadge = ({ status }) => {
  const tone = STATUS_TONES[status] || 'neutral';
  const { pill, dot } = TONE_STYLES[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {typeof status === 'string' ? status.replace('_', ' ') : status}
    </span>
  );
};

export default StatusBadge;
