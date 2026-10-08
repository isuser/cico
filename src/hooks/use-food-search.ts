import { useEffect, useState } from 'react';

import { getProfile, getRecentFoods, searchFoodsLocal, useDatabase, type Food } from '@/db';
import type { CountryCode } from '@/lib/countries';
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
  /** The profile country the search was localized to, or null for a worldwide search. */
  searchCountry: CountryCode | null;
  /**
   * True when the `searchCountry` search found nothing and `remoteResults` came from a worldwide
   * retry instead.
   */
  fellBackToWorldwide: boolean;
};

export function useFoodSearch(query: string): FoodSearchState {
  const db = useDatabase();
  const [localResults, setLocalResults] = useState<Food[]>([]);
  const [remoteResults, setRemoteResults] = useState<OpenFoodFactsProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<OpenFoodFactsErrorKind | null>(null);
  const [searchCountry, setSearchCountry] = useState<CountryCode | null>(null);
  const [fellBackToWorldwide, setFellBackToWorldwide] = useState(false);

  const trimmed = query.trim();

  useEffect(() => {
    let cancelled = false;

    if (trimmed.length === 0) {
      getRecentFoods(db).then((recent) => {
        if (!cancelled) setLocalResults(recent);
      });
      setRemoteResults([]);
      setRemoteError(null);
      setSearchCountry(null);
      setFellBackToWorldwide(false);
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
        const country = (await getProfile(db))?.country ?? null;
        let remote = await searchOpenFoodFacts(trimmed, country);
        let fellBack = false;
        // Only retry on a genuinely empty country search — OFF rate-limits searches, so a
        // successful search with results never costs a second request.
        if (country && remote.length === 0 && !cancelled) {
          remote = await searchOpenFoodFacts(trimmed);
          fellBack = true;
        }
        if (!cancelled) {
          setRemoteResults(remote);
          setRemoteError(null);
          setSearchCountry(country);
          setFellBackToWorldwide(fellBack);
        }
      } catch (error) {
        if (!cancelled) {
          setRemoteResults([]);
          setRemoteError(error instanceof OpenFoodFactsError ? error.kind : 'network');
          setSearchCountry(null);
          setFellBackToWorldwide(false);
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

  return { localResults, remoteResults, loading, remoteError, searchCountry, fellBackToWorldwide };
}
