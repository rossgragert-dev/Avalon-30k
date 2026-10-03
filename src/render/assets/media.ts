import { hasExternalPublicAssetOrigin, staticAssetUrl } from '../../static_asset_url';
import { MEDIA_ASSETS } from './manifest.generated';

function logicalPath(url: string): string {
  return url.replace(/^\/+/, '');
}

export function assetUrl(url: string): string {
  const logical = logicalPath(url);
  if (hasExternalPublicAssetOrigin()) return staticAssetUrl(logical);
  if (import.meta.env.DEV) return `/${logical}`;
  return staticAssetUrl(MEDIA_ASSETS[logical] ?? logical);
}
