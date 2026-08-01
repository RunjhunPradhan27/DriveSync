/**
 * Card-style shell for a data table: rounded/bordered/shadowed container,
 * horizontal scroll on overflow, sticky header. Pages still write their own
 * <table>/<thead>/<tbody> markup (column sets differ per resource) but wrap
 * it in <Table> and use the exported class constants below for consistent
 * enterprise-table styling everywhere.
 */
const Table = ({ children }) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table>
    </div>
  </div>
);

export const theadClass = 'sticky top-0 z-10 bg-slate-50/95 backdrop-blur';
export const thClass = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500';
export const tbodyClass = 'divide-y divide-slate-100 bg-white';
export const trClass = 'transition-colors hover:bg-slate-50';
export const tdClass = 'px-4 py-3.5 text-slate-700';
export const tdEmphasisClass = 'px-4 py-3.5 font-medium text-slate-900';

export default Table;
