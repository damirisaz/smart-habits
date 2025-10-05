export const colors = {
  bg: '#0f1216',
  card: '#111827',
  text: '#e5e7eb',
  subtext: '#9ca3af',
  primary: '#10b981',
  primaryDark: '#065f46',
  accent: '#6ee7b7',
  warn: '#f59e0b'
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16
} as const;

export const typography = {
  title: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 16, color: colors.text },
  muted: { fontSize: 14, color: colors.subtext }
} as const;


