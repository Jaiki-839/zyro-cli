import { ThemeName, ThemePalette } from '../types';

/**
 * All built-in color themes. Each palette maps semantic roles
 * (primary, accent, error, etc.) to a hex color so the rest of the
 * app never hard-codes colors directly.
 */
export const THEMES: Record<ThemeName, ThemePalette> = {
  dark: {
    name: 'dark',
    primary: '#7C8CF8',
    secondary: '#A0A8D8',
    accent: '#F7B733',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    muted: '#6B7280',
    text: '#E5E7EB',
  },
  light: {
    name: 'light',
    primary: '#2563EB',
    secondary: '#475569',
    accent: '#D97706',
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    muted: '#94A3B8',
    text: '#111827',
  },
  matrix: {
    name: 'matrix',
    primary: '#00FF41',
    secondary: '#00B32C',
    accent: '#39FF14',
    success: '#00FF41',
    warning: '#CFFF04',
    error: '#FF3131',
    muted: '#0D5C26',
    text: '#B9FFCB',
  },
  cyberpunk: {
    name: 'cyberpunk',
    primary: '#F72585',
    secondary: '#7209B7',
    accent: '#4CC9F0',
    success: '#4ADE80',
    warning: '#FFD60A',
    error: '#FF0054',
    muted: '#560A86',
    text: '#F0E7FF',
  },
  dracula: {
    name: 'dracula',
    primary: '#BD93F9',
    secondary: '#6272A4',
    accent: '#FF79C6',
    success: '#50FA7B',
    warning: '#F1FA8C',
    error: '#FF5555',
    muted: '#44475A',
    text: '#F8F8F2',
  },
  nord: {
    name: 'nord',
    primary: '#88C0D0',
    secondary: '#81A1C1',
    accent: '#EBCB8B',
    success: '#A3BE8C',
    warning: '#EBCB8B',
    error: '#BF616A',
    muted: '#4C566A',
    text: '#ECEFF4',
  },
  'tokyo-night': {
    name: 'tokyo-night',
    primary: '#7AA2F7',
    secondary: '#BB9AF7',
    accent: '#E0AF68',
    success: '#9ECE6A',
    warning: '#E0AF68',
    error: '#F7768E',
    muted: '#565F89',
    text: '#C0CAF5',
  },
  gruvbox: {
    name: 'gruvbox',
    primary: '#FE8019',
    secondary: '#B8BB26',
    accent: '#FABD2F',
    success: '#B8BB26',
    warning: '#FABD2F',
    error: '#FB4934',
    muted: '#928374',
    text: '#EBDBB2',
  },
};

/** In-memory cache of the active theme so we don't re-read config on every log call. */
let activeThemeName: ThemeName = 'dark';

export function setActiveThemeName(name: ThemeName): void {
  activeThemeName = name;
}

export function getActiveTheme(): ThemePalette {
  return THEMES[activeThemeName] ?? THEMES.dark;
}

export function listThemeNames(): ThemeName[] {
  return Object.keys(THEMES) as ThemeName[];
}
