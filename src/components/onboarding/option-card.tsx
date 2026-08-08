import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const ACCENT = '#0274DF';

export function OptionCard({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <ThemedView
        type={selected ? 'backgroundSelected' : 'backgroundElement'}
        style={{
          borderRadius: Spacing.three,
          padding: Spacing.three,
          gap: Spacing.half,
          borderWidth: selected ? 2 : 0,
          borderColor: ACCENT,
        }}>
        <ThemedText type="smallBold">{label}</ThemedText>
        {description ? (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}
