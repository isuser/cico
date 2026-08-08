import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, FontFamily, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'display'
    | 'stat'
    | 'label'
    | 'bold';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        type === 'display' && styles.display,
        type === 'stat' && styles.stat,
        type === 'label' && styles.label,
        type === 'bold' && styles.bold,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: { fontFamily: FontFamily.medium, fontSize: 14, lineHeight: 20 },
  smallBold: { fontFamily: FontFamily.bold, fontSize: 14, lineHeight: 20 },
  default: { fontFamily: FontFamily.medium, fontSize: 16, lineHeight: 24 },
  title: { fontFamily: FontFamily.semiBold, fontSize: 48, lineHeight: 52 },
  subtitle: { fontFamily: FontFamily.semiBold, fontSize: 32, lineHeight: 44 },
  link: { fontFamily: FontFamily.regular, lineHeight: 30, fontSize: 14 },
  linkPrimary: { fontFamily: FontFamily.regular, lineHeight: 30, fontSize: 14, color: '#3c87f7' },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
  // Screen titles, e.g. "Dashboard" / "CICO" / "Profile".
  display: { fontFamily: FontFamily.extraBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.02 * 28 },
  // Big numbers, e.g. "1,890 kcal".
  stat: { fontFamily: FontFamily.extraBold, fontSize: 20, lineHeight: 24, letterSpacing: -0.02 * 20 },
  // Muted captions, e.g. "Week avg".
  label: { fontFamily: FontFamily.regular, fontSize: 12, lineHeight: 16 },
  // Bold row labels, e.g. "Log this week's weight".
  bold: { fontFamily: FontFamily.bold, fontSize: 14, lineHeight: 18 },
});
