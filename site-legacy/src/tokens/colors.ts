export const colors = {
  ink: {
    50:  '#FAFAFA',
    100: '#F5F4F1',
    200: '#E8E6E1',
    300: '#C9C6BF',
    400: '#8E8B85',
    500: '#5A5854',
    600: '#2E2D2A',
    700: '#1A1917',
    900: '#0A0A0A',
  },
  sepia: {
    300: '#D4C4A8',
    500: '#8B7355',
    700: '#5C4A33',
  },
  gold: {
    300: '#E8D5A8',
    500: '#C9A961',
    700: '#8B7335',
  },
} as const;

export const lightMode = {
  bg: colors.ink[50],
  bgCard: colors.ink[100],
  border: colors.ink[200],
  text: colors.ink[600],
  textBold: colors.ink[700],
  textMuted: colors.ink[400],
  accent: colors.gold[500],
  link: colors.ink[600],
  linkHover: colors.sepia[500],
} as const;

export const darkMode = {
  bg: colors.ink[900],
  bgCard: colors.ink[700],
  border: colors.ink[600],
  text: colors.ink[200],
  textBold: colors.ink[50],
  textMuted: colors.ink[400],
  accent: colors.gold[300],
  link: colors.ink[200],
  linkHover: colors.sepia[300],
} as const;
