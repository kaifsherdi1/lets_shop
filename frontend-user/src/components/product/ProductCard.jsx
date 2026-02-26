import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';

/**
 * ProductCard — styled to closely match the Charitics template donation card:
 * - Image top with category badge (orange pill, top-left)
 * - White body: name, short description, price, stock
 * - Bottom: "Shop Now →" arrow link (like "Donate now →") + "Add to Cart" pill
 */
const ProductCard = ({ product, currency, onAddToCart, isAuthenticated }) => {
  const price = currency === 'INR' ? product.price_inr : product.price_aed;
  const inStock = product.stock_quantity > 0;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.13)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)';
      }}
    >
      {/* ── Image area ── */}
      <div style={{ position: 'relative', paddingTop: '62%', background: '#e9edf0', overflow: 'hidden' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.6s ease',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #e9edf0, #d1d8e0)',
            fontSize: '3rem', color: '#aab',
          }}>
            🛍️
          </div>
        )}

        {/* Category tag — orange pill, top-left (matches template) */}
        {product.category?.name && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'var(--ul-primary)', color: '#fff',
            padding: '4px 13px', borderRadius: '999px',
            fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.02em',
          }}>
            {product.category.name}
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ background: '#e53e3e', color: '#fff', padding: '6px 18px', borderRadius: '999px', fontWeight: 700, fontSize: '0.82rem' }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Product name */}
        <h3 style={{
          fontFamily: 'var(--font-quicksand)', fontWeight: 700,
          fontSize: '1rem', color: 'var(--ul-black)',
          marginBottom: '8px', letterSpacing: '-0.02em', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        {/* Short description — like template's card body text */}
        {product.description && (
          <p style={{
            color: 'var(--ul-gray)', fontSize: '0.82rem', lineHeight: 1.6,
            marginBottom: '14px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        <div style={{ marginTop: 'auto' }}>
          {/* Price row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '14px',
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--ul-primary)' }}>
              {formatCurrency(price, currency)}
            </span>
            {inStock && (
              <span style={{ fontSize: '0.75rem', color: '#38a169', fontWeight: 600, background: '#e6ffed', padding: '3px 10px', borderRadius: '999px' }}>
                ✓ {product.stock_quantity} left
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--ul-gray3)', marginBottom: '14px' }} />

          {/* Action row — matches template "Donate now →" style */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              to={`/products/${product.id}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--ul-black)', fontWeight: 700, fontSize: '0.88rem',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ul-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ul-black)'}
            >
              View Details
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'var(--ul-primary)', color: '#fff', fontSize: '0.75rem',
              }}>→</span>
            </Link>

            <button
              onClick={() => onAddToCart(product.id)}
              disabled={!inStock}
              style={{
                background: inStock ? 'var(--ul-black)' : 'var(--ul-gray2)',
                color: '#fff', border: 'none', borderRadius: '999px',
                padding: '8px 18px', fontWeight: 700, fontSize: '0.82rem',
                cursor: inStock ? 'pointer' : 'not-allowed',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={e => { if (inStock) e.currentTarget.style.background = 'var(--ul-primary)'; }}
              onMouseLeave={e => { if (inStock) e.currentTarget.style.background = 'var(--ul-black)'; }}
            >
              {inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
