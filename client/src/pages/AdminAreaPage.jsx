/**
 * Minimal placeholder proving the Admin-only route guard works end-to-end.
 * Real dashboard content arrives in the Dashboard module.
 */
const AdminAreaPage = () => (
  <div className="max-w-md">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Area</h1>
    <p className="text-sm text-gray-500">
      This page is only reachable by the Admin role. The full admin dashboard is coming in the next module.
    </p>
  </div>
);

export default AdminAreaPage;
