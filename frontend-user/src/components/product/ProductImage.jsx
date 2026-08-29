import React, { useState } from 'react';
import { productImage, resolveProductImage } from '../../utils/image';

/**
 * Product image with a graceful fallback: if the source is missing or fails to
 * load (dead URL, network error), a branded placeholder tile is shown instead
 * of a broken-image icon.
 */
export default function ProductImage({ product, src, alt, style, className }) {
  const initial = src ? resolveProductImage(src) : productImage(product);
  const [failed, setFailed] = useState(false);
  const label = alt || product?.name || 'Product';

  if (!initial || failed) {
    return (
      <div
        className={className}
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eef2f3, #dfe6e9)',
          color: '#9aa5ad',
          fontSize: '2.2rem',
          ...style,
        }}
      >
        <span aria-hidden="true">🛍️</span>
      </div>
    );
  }

  return (
    <img
      src={initial}
      alt={label}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      style={style}
    />
  );
}
