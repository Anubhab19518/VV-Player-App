export const Colors = {
  // Brand
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryHover: '#3B82F6',

  // Surfaces & Backgrounds
  background: '#F8FAFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  surfaceSubtle: '#EFF6FF',
  surfaceDark: '#0B132B',

  // Text
  textPrimary: '#0F1B3D',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Tiers
  bronze: '#A97142',
  bronzeBg: '#FDF6EE',
  bronzeBorder: '#F3D8C3',
  silver: '#64748B',
  silverBg: '#F1F5F9',
  silverBorder: '#CBD5E1',
  gold: '#D97706',
  goldBg: '#FEF3C7',
  goldBorder: '#FDE68A',
  platinum: '#4F46E5',
  platinumBg: '#EEF2FF',
  platinumBorder: '#C7D2FE',

  // Functional Status
  success: '#16A34A',
  successBg: '#DCFCE7',
  successBorder: '#86EFAC',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  errorBorder: '#FCA5A5',

  // Cricket accents
  pitchGreen: '#15803D',
  cricketRed: '#DC2626',
} as const;

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#0F1B3D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F1B3D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F1B3D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
