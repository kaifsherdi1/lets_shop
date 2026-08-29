import React, { useState } from 'react';
import { firstImage } from '../utils/image.js';

/** Product thumbnail with a graceful fallback when the image URL is missing or dead. */
export default function Thumb({ product, src, alt = '' }) {
  const initial = src || firstImage(product);
  const [failed, setFailed] = useState(false);

  if (!initial || failed) {
    return (
      <div className="product-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        📦
      </div>
    );
  }
  return (
    <img
      src={initial}
      className="product-thumb"
      alt={alt || product?.name || ''}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
