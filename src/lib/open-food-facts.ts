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

/** Always fetches fresh — no local-first caching of search results themselves. */
export async function searchOpenFoodFacts(query: string): Promise<OpenFoodFactsProduct[]> {
  const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(
    query
  )}&search_simple=1&action=process&json=1&page_size=20`;
  const response = await fetch(url, { signal: timeoutSignal(FETCH_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`Open Food Facts search failed: ${response.status}`);
  }
  const data: { products?: RawProduct[] } = await response.json();
  return (data.products ?? [])
    .map(mapProduct)
    .filter((product): product is OpenFoodFactsProduct => product !== null);
}

export async function lookupBarcodeOpenFoodFacts(
  barcode: string
): Promise<OpenFoodFactsProduct | null> {
  const url = `${BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}.json`;
  const response = await fetch(url, { signal: timeoutSignal(FETCH_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`Open Food Facts lookup failed: ${response.status}`);
  }
  const data: { status?: number; product?: RawProduct } = await response.json();
  if (data.status !== 1 || !data.product) {
    return null;
  }
  return mapProduct({ ...data.product, code: data.product.code ?? barcode });
}
