export type Theme = 'dark' | 'light' | 'system';

export function getActiveTheme(theme: Theme): Exclude<Theme, 'system'> {
  if (theme !== 'system') {
    return theme;
  }

  if (typeof window !== 'undefined') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }

  return 'light';
}
