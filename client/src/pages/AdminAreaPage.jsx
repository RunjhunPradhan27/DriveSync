import { ShieldCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';

/**
 * Minimal placeholder proving the Admin-only route guard works end-to-end.
 * Real dashboard content arrives in the Dashboard module.
 */
const AdminAreaPage = () => (
  <div className="max-w-md">
    <PageHeader icon={ShieldCheck} title="Admin Area" />
    <Card>
      <p className="text-sm text-slate-500">
        This page is only reachable by the Admin role. The full admin dashboard is coming in the next module.
      </p>
    </Card>
  </div>
);

export default AdminAreaPage;
