import { useEffect, useState } from 'react';

import { getRecentFoods, searchFoodsLocal, useDatabase, type Food } from '@/db';
import { searchOpenFoodFacts, type OpenFoodFactsProduct } from '@/lib/open-food-facts';

const DEBOUNCE_MS = 350;

export type FoodSearchState = {
  /** Cached/custom foods matching the query — or, when the query is empty, recently used foods. */
  localResults: Food[];
  /** Fresh Open Food Facts results — empty when offline or the query is empty. */
  remoteResults: OpenFoodFactsProduct[];
  loading: boolean;
  /** True when the remote fetch failed (network error/timeout) — show the offline banner. */
  offline: boolean;
};

export function useFoodSearch(query: string): FoodSearchState {
  const db = useDatabase();
  const [localResults, setLocalResults] = useState<Food[]>([]);
  const [remoteResults, setRemoteResults] = useState<OpenFoodFactsProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const trimmed = query.trim();

  useEffect(() => {
    let cancelled = false;

    if (trimmed.length === 0) {
      getRecentFoods(db).then((recent) => {
        if (!cancelled) setLocalResults(recent);
      });
      setRemoteResults([]);
      setOffline(false);
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
          setOffline(false);
        }
      } catch {
        if (!cancelled) {
          setRemoteResults([]);
          setOffline(true);
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

  return { localResults, remoteResults, loading, offline };
}
