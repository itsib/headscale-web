export function normalizeUrl(base: string, path: string): string {
  if (base.endsWith('/') && path.startsWith('/')) {
    path = path.slice(1);
  }
  return base + path;
}