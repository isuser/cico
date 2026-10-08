import { useEffect, useState } from 'react';

import { getRecentFoods, searchFoodsLocal, useDatabase, type Food } from '@/db';
import {
  OpenFoodFactsError,
  searchOpenFoodFacts,
  type OpenFoodFactsErrorKind,
  type OpenFoodFactsProduct,
} from '@/lib/open-food-facts';

const DEBOUNCE_MS = 350;

export type FoodSearchState = {
  /** Cached/custom foods matching the query — or, when the query is empty, recently used foods. */
  localResults: Food[];
  /** Fresh Open Food Facts results — empty when the fetch failed or the query is empty. */
  remoteResults: OpenFoodFactsProduct[];
  loading: boolean;
  /**
   * Why the remote fetch failed, or null when it succeeded (including with zero results).
   * `network` → no connection/timeout; `service` → Open Food Facts itself errored.
   */
  remoteError: OpenFoodFactsErrorKind | null;
};

export function useFoodSearch(query: string): FoodSearchState {
  const db = useDatabase();
  const [localResults, setLocalResults] = useState<Food[]>([]);
  const [remoteResults, setRemoteResults] = useState<OpenFoodFactsProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<OpenFoodFactsErrorKind | null>(null);

  const trimmed = query.trim();

  useEffect(() => {
    let cancelled = false;

    if (trimmed.length === 0) {
      getRecentFoods(db).then((recent) => {
        if (!cancelled) setLocalResults(recent);
      });
      setRemoteResults([]);
      setRemoteError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const local = await searchFoodsLocal(db, trimmed);
      if (cancelled) return;
      setLocalResults(local);

      try {
        const remote = await searchOpenFoodFacts(trimmed);
        if (!cancelled) {
          setRemoteResults(remote);
          setRemoteError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setRemoteResults([]);
          setRemoteError(error instanceof OpenFoodFactsError ? error.kind : 'network');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [db, trimmed]);

  return { localResults, remoteResults, loading, remoteError };
}
