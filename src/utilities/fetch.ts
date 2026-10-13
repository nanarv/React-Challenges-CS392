import { useEffect, useState } from 'react';

export type QueryState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export function useJsonQuery<T>(url: string): QueryState<T> {
  const [result, setResult] = useState<{ url: string; state: QueryState<T> }>();

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then(data => setResult({ url, state: { status: 'success', data } }))
      .catch(err => {
        if (controller.signal.aborted) return; // request was cancelled on purpose
        setResult({ url, state: { status: 'error', error: err instanceof Error ? err : new Error(String(err)) } });
      });

    return () => controller.abort();
  }, [url]);

  // A result for a different (older) url means the current request is still loading
  return result?.url === url ? result.state : { status: 'loading' };
}
