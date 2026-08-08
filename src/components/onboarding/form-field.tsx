import { TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function FormField({
  label,
  suffix,
  style,
  ...inputProps
}: TextInputProps & { label: string; suffix?: string }) {
  const theme = useTheme();

  return (
    <View style={{ gap: Spacing.one }}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <ThemedView
        type="backgroundElement"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: Spacing.three,
          paddingHorizontal: Spacing.three,
        }}>
        <TextInput
          placeholderTextColor={theme.textSecondary}
          {...inputProps}
          style={[{ flex: 1, paddingVertical: Spacing.three, fontSize: 16, color: theme.text }, style]}
        />
        {suffix ? (
          <ThemedText themeColor="textSecondary" style={{ marginLeft: Spacing.two }}>
            {suffix}
          </ThemedText>
        ) : null}
      </ThemedView>
    </View>
  );
}
