const externalOrigin = String(import.meta.env.VITE_PUBLIC_ASSET_ORIGIN ?? '')
  .trim()
  .replace(/\/+$/, '');

export function hasExternalPublicAssetOrigin(): boolean {
  return externalOrigin.length > 0;
}

/**
 * Resolve a public/static asset for either:
 * - normal root-hosted development/production;
 * - a Vite subpath deployment such as GitHub Pages; or
 * - an external public-asset origin used by the lightweight browser test build.
 */
export function staticAssetUrl(path: string): string {
  if (/^(?:https?:|data:|blob:)/.test(path)) return path;
  const normalized = path.replace(/^\/+/, '');
  if (externalOrigin) return `${externalOrigin}/${normalized}`;
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${base}${normalized}`;
}
