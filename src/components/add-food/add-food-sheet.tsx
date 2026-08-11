import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, View } from 'react-native';

import { BarcodeScannerScreen } from '@/components/add-food/barcode-scanner-screen';
import { CustomFoodScreen } from '@/components/add-food/custom-food-screen';
import { PortionScreen } from '@/components/add-food/portion-screen';
import { SearchScreen } from '@/components/add-food/search-screen';
import {
  findFoodByBarcode,
  insertFood,
  insertFoodLog,
  useDatabase,
  type Food,
  type MealType,
} from '@/db';
import { useTranslation } from '@/i18n/context';
import { MEAL_TYPE_KEYS } from '@/lib/mealTypes';
import { lookupBarcodeOpenFoodFacts, type OpenFoodFactsProduct } from '@/lib/open-food-facts';

type SheetView = 'search' | 'custom' | 'portion' | 'scanner';

export function AddFoodSheet({
  mealType,
  date,
  onClose,
  onLogged,
}: {
  mealType: MealType | null;
  date: string;
  onClose: () => void;
  onLogged: () => void;
}) {
  const db = useDatabase();
  const { t } = useTranslation();
  const [view, setView] = useState<SheetView>('search');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  useEffect(() => {
    if (mealType) {
      setView('search');
      setSelectedFood(null);
    }
  }, [mealType]);

  if (!mealType) {
    return null;
  }

  const mealLabel = t(MEAL_TYPE_KEYS[mealType]);

  const cacheRemoteProduct = async (product: OpenFoodFactsProduct): Promise<Food> => {
    const existing = await findFoodByBarcode(db, product.barcode);
    if (existing) return existing;
    return insertFood(db, {
      name: product.name,
      calories_per_100g: product.caloriesPer100g,
      protein_g: product.proteinG,
      fat_g: product.fatG,
      saturated_fat_g: product.saturatedFatG,
      carbs_g: product.carbsG,
      sugar_g: product.sugarG,
      fiber_g: product.fiberG,
      sodium_mg: product.sodiumMg,
      salt_g: product.saltG,
      source: 'open_food_facts',
      barcode: product.barcode,
      reference_portion: null,
      fetched_at: new Date().toISOString(),
    });
  };

  const handleSelectRemote = async (product: OpenFoodFactsProduct) => {
    const food = await cacheRemoteProduct(product);
    setSelectedFood(food);
    setView('portion');
  };

  const handleBarcodeScanned = async (barcode: string) => {
    const cached = await findFoodByBarcode(db, barcode);
    if (cached) {
      setSelectedFood(cached);
      setView('portion');
      return;
    }

    try {
      const product = await lookupBarcodeOpenFoodFacts(barcode);
      if (product) {
        await handleSelectRemote(product);
      } else {
        Alert.alert(
          t('addFood.productNotFound.title'),
          t('addFood.productNotFound.message'),
          [{ text: t('common.ok'), onPress: () => setView('search') }]
        );
      }
    } catch {
      Alert.alert(t('addFood.cannotLookup.title'), t('addFood.cannotLookup.message'), [
        { text: t('common.ok'), onPress: () => setView('search') },
      ]);
    }
  };

  const handleCustomSubmit = async (data: {
    name: string;
    caloriesPer100g: number;
    referencePortion: string | null;
  }) => {
    const food = await insertFood(db, {
      name: data.name,
      calories_per_100g: data.caloriesPer100g,
      protein_g: null,
      fat_g: null,
      saturated_fat_g: null,
      carbs_g: null,
      sugar_g: null,
      fiber_g: null,
      sodium_mg: null,
      salt_g: null,
      source: 'custom',
      barcode: null,
      reference_portion: data.referencePortion,
      fetched_at: null,
    });
    setSelectedFood(food);
    setView('portion');
  };

  const handleLogPortion = async (grams: number, calories: number) => {
    if (!selectedFood) return;
    await insertFoodLog(db, {
      food_id: selectedFood.id,
      date,
      meal_type: mealType,
      food_name: selectedFood.name,
      grams,
      calories,
    });
    onLogged();
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      {view === 'scanner' ? (
        <BarcodeScannerScreen onClose={() => setView('search')} onScanned={handleBarcodeScanned} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
          {view === 'search' ? (
            <SearchScreen
              mealLabel={mealLabel}
              onClose={onClose}
              onOpenScanner={() => setView('scanner')}
              onOpenCustom={() => setView('custom')}
              onSelectLocal={(food) => {
                setSelectedFood(food);
                setView('portion');
              }}
              onSelectRemote={handleSelectRemote}
            />
          ) : null}
          {view === 'custom' ? (
            <CustomFoodScreen mealLabel={mealLabel} onBack={() => setView('search')} onSubmit={handleCustomSubmit} />
          ) : null}
          {view === 'portion' && selectedFood ? (
            <PortionScreen
              food={selectedFood}
              mealLabel={mealLabel}
              onClose={onClose}
              onLog={handleLogPortion}
            />
          ) : null}
        </View>
      )}
    </Modal>
  );
}
