import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';
import { searchExerciseActivities, type ExerciseActivity } from '@/lib/exerciseActivities';

export function SearchScreen({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (activity: ExerciseActivity) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const hasQuery = query.trim().length > 0;
  const results = searchExerciseActivities(query);

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
            {t('addExercise.search.title')}
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
            placeholder={t('addExercise.search.placeholder')}
            placeholderTextColor={theme.textSecondary}
            style={{ flex: 1, paddingVertical: Spacing.three, fontSize: 15, color: theme.text }}
            autoFocus
          />
          {hasQuery ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <ThemedText type="default" themeColor="textSecondary">
                ✕
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {!hasQuery ? (
            <ThemedText type="label" themeColor="textSecondary">
              {t('addExercise.search.hint')}
            </ThemedText>
          ) : results.length === 0 ? (
            <ThemedText type="label" themeColor="textSecondary">
              {t('addExercise.search.noResults')}
            </ThemedText>
          ) : (
            results.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} onPress={() => onSelect(activity)} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function ActivityRow({
  activity,
  onPress,
}: {
  activity: ExerciseActivity;
  onPress: () => void;
}) {
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
      <ThemedText type="bold" style={{ fontSize: 15, lineHeight: 20, flex: 1 }}>
        {activity.name}
      </ThemedText>
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
