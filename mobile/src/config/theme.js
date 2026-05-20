/**
 * Design System — OmniTask Dark Glassmorphism Theme
 * Premium dark theme with terracotta/peach accents and high-contrast glass effects.
 * WCAG AA compliant text contrast on all surfaces.
 */

export const COLORS = {
  // Page & Surfaces
  pageBg: '#210f37',          // Deep Dark Purple
  surfaceBg: '#1E1245',       // Slightly lighter for content pages
  cardBg: 'rgba(255, 255, 255, 0.06)',   // Dark glass card
  cardBgSolid: 'rgba(79, 28, 81, 0.35)', // Plum/Magenta Transparent
  cardBorder: 'rgba(165, 91, 75, 0.25)', // Terracotta border
  cardBorderLight: 'rgba(220, 160, 109, 0.15)', // Peach border subtle

  // Gradients
  heroGradient: ['#210f37', '#1a0c2c', '#2b1447'],
  primaryGradient: ['#a55b4b', '#dca06d'],
  surfaceGradient: ['#1E1245', '#210f37'],

  // Core Accents
  primary: '#a55b4b',        // Terracotta
  primaryDark: '#D4836B',    // Lighter Terracotta (readable on dark)
  primaryLight: '#E8A990',   // Even lighter for badges
  secondary: '#dca06d',      // Peach accent
  cyanAccent: '#dca06d',     // Peach
  accentBlue: '#818CF8',     // Indigo for highlights
  accentCyan: '#22D3EE',     // Cyan for charts/metrics

  // Semantics
  success: '#34D399',        // Bright green (visible on dark)
  successDark: '#065F46',    // Dark green for badges
  successBg: 'rgba(52, 211, 153, 0.12)',
  warning: '#FBBF24',        // Bright amber
  warningBg: 'rgba(251, 191, 36, 0.12)',
  danger: '#FB7185',         // Bright rose (visible on dark)
  dangerDark: '#E11D48',
  dangerBg: 'rgba(251, 113, 133, 0.12)',

  // Text — High Contrast
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.75)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textOnLight: '#1E1B4B',    // For light-bg badges
  textLink: '#C4B5FD',       // Violet link color

  // Overlays
  overlayLight: 'rgba(255, 255, 255, 0.04)',
  overlayMedium: 'rgba(255, 255, 255, 0.08)',
  overlayStrong: 'rgba(255, 255, 255, 0.12)',
  divider: 'rgba(255, 255, 255, 0.08)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 36,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 28,
};

export const BORDER_RADIUS = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 20,
  round: 9999,
};

export const SHADOWS = {
  glass: {
    shadowColor: '#a55b4b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  cta: {
    shadowColor: '#a55b4b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
  glow: {
    shadowColor: '#dca06d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
};
