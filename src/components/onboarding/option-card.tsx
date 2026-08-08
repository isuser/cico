import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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
  const theme = useTheme();

  return (
    <Pressable onPress={onPress}>
      <ThemedView
        type={selected ? 'accentSoft' : 'backgroundElement'}
        style={{
          borderRadius: Spacing.three,
          padding: Spacing.three,
          gap: Spacing.half,
          borderWidth: selected ? 2 : 0,
          borderColor: theme.accent,
        }}>
        <ThemedText type="bold" style={selected ? { color: theme.accent } : undefined}>
          {label}
        </ThemedText>
        {description ? (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}
