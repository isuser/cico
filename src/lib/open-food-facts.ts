import type { CountryCode } from '@/lib/countries';

export type OpenFoodFactsProduct = {
  barcode: string;
  name: string;
  caloriesPer100g: number;
  proteinG: number | null;
  fatG: number | null;
  saturatedFatG: number | null;
  carbsG: number | null;
  sugarG: number | null;
  fiberG: number | null;
  sodiumMg: number | null;
  saltG: number | null;
};

const BASE_URL = 'https://world.openfoodfacts.org';
const FETCH_TIMEOUT_MS = 8000;

function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * `network`: the request never got a response (no internet, DNS failure, timeout).
 * `service`: Open Food Facts responded, but with an error status or a non-JSON body
 * (e.g. its 503 "temporarily unavailable" HTML page when overloaded or rate limiting).
 */
export type OpenFoodFactsErrorKind = 'network' | 'service';

export class OpenFoodFactsError extends Error {
  constructor(
    readonly kind: OpenFoodFactsErrorKind,
    message: string
  ) {
    super(message);
    this.name = 'OpenFoodFactsError';
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal: timeoutSignal(FETCH_TIMEOUT_MS) });
  } catch (error) {
    throw new OpenFoodFactsError('network', `Open Food Facts request failed: ${String(error)}`);
  }
  if (!response.ok) {
    throw new OpenFoodFactsError('service', `Open Food Facts responded ${response.status}`);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new OpenFoodFactsError('service', 'Open Food Facts returned an invalid response');
  }
}

type RawNutriments = {
  'energy-kcal_100g'?: number;
  proteins_100g?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  sodium_100g?: number;
  salt_100g?: number;
};

type RawProduct = {
  code?: string;
  product_name?: string;
  nutriments?: RawNutriments;
};

function mapProduct(raw: RawProduct): OpenFoodFactsProduct | null {
  const name = raw.product_name?.trim();
  const kcal = raw.nutriments?.['energy-kcal_100g'];
  const barcode = raw.code;
  if (!name || typeof kcal !== 'number' || !barcode) {
    return null;
  }
  return {
    barcode,
    name,
    caloriesPer100g: Math.round(kcal),
    proteinG: raw.nutriments?.proteins_100g ?? null,
    fatG: raw.nutriments?.fat_100g ?? null,
    saturatedFatG: raw.nutriments?.['saturated-fat_100g'] ?? null,
    carbsG: raw.nutriments?.carbohydrates_100g ?? null,
    sugarG: raw.nutriments?.sugars_100g ?? null,
    fiberG: raw.nutriments?.fiber_100g ?? null,
    // Open Food Facts reports sodium in grams per 100g; we store milligrams.
    sodiumMg:
      typeof raw.nutriments?.sodium_100g === 'number' ? raw.nutriments.sodium_100g * 1000 : null,
    saltG: raw.nutriments?.salt_100g ?? null,
  };
}

/**
 * Always fetches fresh — no local-first caching of search results themselves. Passing a
 * `country` restricts results to products sold there (OFF's `cc` parameter); null searches
 * worldwide.
 */
export async function searchOpenFoodFacts(
  query: string,
  country: CountryCode | null = null
): Promise<OpenFoodFactsProduct[]> {
  const countryParam = country ? `&cc=${country}` : '';
  const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(
    query
  )}&search_simple=1&action=process&json=1&page_size=20${countryParam}`;
  const data = await fetchJson<{ products?: RawProduct[] }>(url);
  return (data.products ?? [])
    .map(mapProduct)
    .filter((product): product is OpenFoodFactsProduct => product !== null);
}

export async function lookupBarcodeOpenFoodFacts(
  barcode: string
): Promise<OpenFoodFactsProduct | null> {
  const url = `${BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}.json`;
  const data = await fetchJson<{ status?: number; product?: RawProduct }>(url);
  if (data.status !== 1 || !data.product) {
    return null;
  }
  return mapProduct({ ...data.product, code: data.product.code ?? barcode });
}
