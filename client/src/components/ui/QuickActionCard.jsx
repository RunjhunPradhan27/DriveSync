import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Clickable dashboard shortcut card — icon, title, short description, and an
 * arrow affordance. Purely navigational (wraps an existing route); adds no
 * new capability beyond linking to a page the role already has access to.
 */
const QuickActionCard = ({ to, icon: Icon, title, description }) => (
  <Link
    to={to}
    className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
      <Icon className="h-5 w-5" strokeWidth={2} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-0.5 text-sm text-slate-500">{description}</p>
    </div>
    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500" />
  </Link>
);

export default QuickActionCard;
