import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const theme = useTheme();

  return (
    <ThemedView
      style={{
        borderRadius: Spacing.five,
        padding: Spacing.four,
        gap: Spacing.three,
        borderWidth: 1,
        borderColor: theme.border,
      }}>
      <View style={{ gap: Spacing.half }}>
        <ThemedText type="bold" style={{ fontSize: 18, lineHeight: 22 }}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </ThemedView>
  );
}
