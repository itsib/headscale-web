const PREFIX_URL_RE = /^https?:\/\//;

export function joinUrl(base: string, url: string): string {
  if (!base || !PREFIX_URL_RE.test(base)) {
    throw new Error('INVALID_URL');
  }

  if (/\/$/.test(base)) {
    base = base.slice(0, -1);
  }

  if (/^\//.test(url)) {
    url = url.slice(1);
  }

  return `${base}/${url}`;
}