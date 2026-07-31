/**
 * Reusable "recent activity" panel: a titled card that renders a short list
 * of records via a caller-supplied renderItem, with its own loading/empty/
 * error states so every dashboard can reuse it without repeating this logic.
 */
const RecentActivityList = ({ title, items, loading, error, renderItem, emptyMessage }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      {loading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-600">Unable to load recent activity right now.</p>
      )}

      {!loading && !error && (!items || items.length === 0) && (
        <p className="text-sm text-gray-500">{emptyMessage || 'No recent activity to show.'}</p>
      )}

      {!loading && !error && items && items.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <li key={index} className="py-2 text-sm text-gray-700">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivityList;
