import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Food } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useFoodSearch } from '@/hooks/use-food-search';
import { useTranslation } from '@/i18n/context';
import type { OpenFoodFactsProduct } from '@/lib/open-food-facts';

export function SearchScreen({
  mealLabel,
  onClose,
  onOpenScanner,
  onOpenCustom,
  onSelectLocal,
  onSelectRemote,
}: {
  mealLabel: string;
  onClose: () => void;
  onOpenScanner: () => void;
  onOpenCustom: () => void;
  onSelectLocal: (food: Food) => void;
  onSelectRemote: (product: OpenFoodFactsProduct) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { localResults, remoteResults, offline } = useFoodSearch(query);
  const hasQuery = query.trim().length > 0;

  return (
    <ThemedView
      style={{
        height: '80%',
        borderTopLeftRadius: Spacing.five,
        borderTopRightRadius: Spacing.five,
      }}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, padding: Spacing.four, gap: Spacing.three }}>
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.border,
            alignSelf: 'center',
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText type="bold" style={{ fontSize: 19 }}>
            {t('addFood.search.addToMeal', { meal: mealLabel })}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={8}>
            <ThemedText type="default" themeColor="textSecondary">
              ✕
            </ThemedText>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.two,
            backgroundColor: theme.backgroundElement,
            borderRadius: Spacing.three,
            paddingHorizontal: Spacing.three,
          }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('addFood.search.placeholder')}
            placeholderTextColor={theme.textSecondary}
            style={{ flex: 1, paddingVertical: Spacing.three, fontSize: 15, color: theme.text }}
          />
          {hasQuery ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <ThemedText type="default" themeColor="textSecondary">
                ✕
              </ThemedText>
            </Pressable>
          ) : (
            <Pressable onPress={onOpenScanner} hitSlop={8}>
              <ThemedText type="default" themeColor="textSecondary">
                ⚏
              </ThemedText>
            </Pressable>
          )}
        </View>

        {offline && !bannerDismissed ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.accentSoft,
              borderRadius: Spacing.two,
              padding: Spacing.two,
            }}>
            <ThemedText type="label" style={{ flex: 1 }}>
              {t('addFood.search.offlineBanner')}
            </ThemedText>
            <Pressable onPress={() => setBannerDismissed(true)} hitSlop={8}>
              <ThemedText type="label">✕</ThemedText>
            </Pressable>
          </View>
        ) : null}

        {!hasQuery ? (
          <Pressable
            onPress={onOpenCustom}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.three,
              padding: Spacing.three,
              borderRadius: Spacing.three,
              backgroundColor: theme.accentSoft,
            }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: Spacing.two,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.background,
              }}>
              <ThemedText type="bold" style={{ color: theme.accent }}>
                +
              </ThemedText>
            </View>
            <ThemedText type="bold" style={{ color: theme.accent }}>
              {t('addFood.search.addCustom')}
            </ThemedText>
          </Pressable>
        ) : (
          <ThemedText type="label" themeColor="textSecondary">
            {t('addFood.search.openFoodFactsResults', {
              count: remoteResults.length,
            })}
          </ThemedText>
        )}

        {!hasQuery && localResults.length > 0 ? (
          <ThemedText type="label" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
            {t('addFood.search.recent')}
          </ThemedText>
        ) : null}

        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {localResults.map((food) => (
            <FoodRow
              key={`local-${food.id}`}
              name={food.name}
              sub={t('addFood.search.caloriesPer100g', { calories: food.calories_per_100g })}
              onPress={() => onSelectLocal(food)}
            />
          ))}
          {remoteResults.map((product) => (
            <FoodRow
              key={`remote-${product.barcode}`}
              name={product.name}
              sub={t('addFood.search.caloriesPer100g', { calories: product.caloriesPer100g })}
              onPress={() => onSelectRemote(product)}
            />
          ))}
          {hasQuery ? (
            <Pressable
              onPress={onOpenCustom}
              style={{ paddingVertical: Spacing.three, alignItems: 'center' }}>
              <ThemedText type="bold" style={{ color: theme.accent }}>
                {t('addFood.search.addCustomPrompt')}
              </ThemedText>
            </Pressable>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function FoodRow({ name, sub, onPress }: { name: string; sub: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.three,
      }}>
      <View>
        <ThemedText type="bold" style={{ fontSize: 15, lineHeight: 20 }}>
          {name}
        </ThemedText>
        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: 2 }}>
          {sub}
        </ThemedText>
      </View>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: Spacing.two,
          backgroundColor: theme.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ThemedText type="bold" style={{ color: theme.accent }}>
          +
        </ThemedText>
      </View>
    </Pressable>
  );
}
