import { useEffect, useState } from 'react';

/**
 * Runs an async fetcher and tracks its data/loading/error state, re-running
 * whenever `deps` changes. Ignores results from a stale run if the
 * component unmounts or deps change again before it resolves.
 * @param {Function} fetcher - Async function returning the data to store
 * @param {Array} deps - Dependency array controlling re-fetch
 */
const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!isCancelled) setData(result);
      })
      .catch((err) => {
        if (!isCancelled) setError(err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};

export default useFetch;
