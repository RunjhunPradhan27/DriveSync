import { Search } from 'lucide-react';

/**
 * Styled search box with a leading icon — used at the top of every list
 * page's client-side filter. Behaves like a plain controlled <input>.
 */
const SearchInput = ({ className = '', ...props }) => (
  <div className={`relative w-full max-w-md ${className}`}>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
    <input
      type="text"
      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      {...props}
    />
  </div>
);

export default SearchInput;
