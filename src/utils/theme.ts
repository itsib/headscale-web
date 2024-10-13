export enum Theme {
  Dark = 1,
  Light = 2,
  System = 3,
}

export function getActiveTheme(): Theme {
  const stored = localStorage.getItem('headscale.theme');
  if (stored && (stored === 'dark' || stored === 'light')) {
    return stored === 'dark' ? Theme.Dark : Theme.Light;
  }
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark ? Theme.Dark : Theme.Light;
}