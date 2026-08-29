/**
 * Image URL helpers for the storefront.
 *
 * The API returns product images either as absolute URLs (seed data / S3) or as
 * server-relative paths such as `/storage/products/abc.jpg`. This normalises both
 * to a URL the browser can load, and rewrites stale localhost origins when the
 * app itself is not running on localhost (helps staging/demo environments).
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Origin of the backend, derived from the API base URL (strip a trailing /api).
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

const isBrowser = typeof window !== 'undefined';
const onLocalhost =
  isBrowser && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

/**
 * Resolve a single product image path/URL to something loadable.
 * Returns null when there is no image so callers can render a placeholder.
 */
export const resolveProductImage = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;

  let src = imagePath.trim();
  if (!src) return null;

  if (/^https?:\/\//i.test(src)) {
    // Rewrite a hard-coded localhost origin when we're deployed elsewhere.
    if (!onLocalhost && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(src)) {
      src = src.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, API_ORIGIN);
    }
    return src;
  }

  const path = src.startsWith('/') ? src : `/${src}`;
  return `${API_ORIGIN}${path}`;
};

/**
 * Pick the first usable image from a product, or null.
 */
export const productImage = (product) => {
  const imgs = product?.images;
  if (Array.isArray(imgs) && imgs.length) return resolveProductImage(imgs[0]);
  if (typeof imgs === 'string') return resolveProductImage(imgs);
  return null;
};
