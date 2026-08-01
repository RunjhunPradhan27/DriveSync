/**
 * "Recent activity" panel: a titled card that renders a short list of
 * records via a caller-supplied renderItem, with its own loading/empty/
 * error states. Same props (`title`, `items`, `loading`, `error`,
 * `renderItem`, `emptyMessage`) and default export as before.
 */
const RecentActivityList = ({ title, items, loading, error, renderItem, emptyMessage }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-sm text-red-600">Unable to load recent activity right now.</p>}

      {!loading && !error && (!items || items.length === 0) && (
        <p className="text-sm text-slate-500">{emptyMessage || 'No recent activity to show.'}</p>
      )}

      {!loading && !error && items && items.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <li key={index} className="py-2.5 text-sm text-slate-700 first:pt-0 last:pb-0">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivityList;
