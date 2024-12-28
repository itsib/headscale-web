export function joinUrl(base: string, url: string): string {
  base = base.endsWith('/') ? base.slice(0, -1) : base;
  url = url.startsWith('/') ? url.slice(1) : url;

  return `${base}/${url}`;
}