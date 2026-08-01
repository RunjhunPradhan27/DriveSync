import { useEffect, useMemo, useState } from 'react';

/**
 * Client-side pagination over an already-fetched array. The backend has no
 * pagination support on any list endpoint, so this purely slices data that
 * was already loaded in full — it changes how a list is *displayed*, not
 * what's fetched or how search/filtering works underneath it.
 * @param {Array} items
 * @param {number} pageSize
 */
const usePagination = (items, pageSize = 10) => {
  const [page, setPage] = useState(1);
  const total = items?.length || 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // Snap back to the last valid page whenever the (filtered) item count
  // shrinks below the current page's range — e.g. after a search narrows results.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (items || []).slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { page, setPage, pageCount, pageItems, total, pageSize };
};

export default usePagination;
