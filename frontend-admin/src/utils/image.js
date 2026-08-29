const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

const onLocalhost =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

/**
 * Normalise a product image path/URL from the API into something loadable.
 * Returns null when there is no image.
 */
export function resolveImage(path) {
  if (!path || typeof path !== 'string') return null;
  let src = path.trim();
  if (!src) return null;

  if (/^https?:\/\//i.test(src)) {
    if (!onLocalhost && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(src)) {
      src = src.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, API_ORIGIN);
    }
    return src;
  }
  return `${API_ORIGIN}${src.startsWith('/') ? src : `/${src}`}`;
}

export function firstImage(product) {
  const imgs = product?.images;
  if (Array.isArray(imgs) && imgs.length) return resolveImage(imgs[0]);
  if (typeof imgs === 'string') return resolveImage(imgs);
  return null;
}
