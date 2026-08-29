import React from 'react';

/**
 * LetsShop brand mark — a crisp inline SVG shopping bag inside a coloured disc.
 * Replaces a 412 KB PNG that was only ever rendered at ~20 px.
 */
export default function BrandMark({ size = 32, iconColor = '#fff', discColor = 'var(--ul-primary)' }) {
  const inner = Math.round(size * 0.58);
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: discColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={inner} height={inner} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 8h12l-1 12H7L6 8Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 8V6a3 3 0 0 1 6 0v2"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
