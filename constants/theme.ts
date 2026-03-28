import { Colors } from './colors';

export const Theme = {
  colors: Colors,
  typography: {
    fontFamily: 'Source Sans Pro',
    // We'll load this font using expo-font
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  /** Top bar: match Ionicons ~24–26pt; logo slightly taller. */
  headerLogoHeight: 28,
  headerLogoMaxWidth: 92,
  headerBarHeight: 36,
} as const;


