/**
 * Centered spinner shown while a page/section's data is loading. Same
 * default export and no-props usage as before — every call site is
 * unaffected by this restyle.
 */
const Loader = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-20">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
    </div>
    <p className="text-xs font-medium text-slate-400">Loading…</p>
  </div>
);

export default Loader;
