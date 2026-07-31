/**
 * Reusable summary card: a label plus a count, with its own inline
 * loading/error state so each card can resolve independently of the others.
 */
const DashboardCard = ({ label, value, loading, error }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>

      {loading ? (
        <div className="mt-2 h-7 w-16 rounded bg-gray-100 animate-pulse" />
      ) : error ? (
        <p className="mt-2 text-2xl font-bold text-gray-300" title="Unable to load this figure">
          &mdash;
        </p>
      ) : (
        <p className="mt-2 text-2xl font-bold text-gray-900">{value ?? 0}</p>
      )}
    </div>
  );
};

export default DashboardCard;
