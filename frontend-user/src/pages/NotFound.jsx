import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ul-gray3)' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '8rem', fontWeight: 900, fontFamily: 'var(--font-quicksand)', color: 'var(--ul-primary)', lineHeight: 1, marginBottom: '8px' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--ul-black)', margin: '0 0 12px' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--ul-gray)', marginBottom: '32px', maxWidth: '380px', margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="ul-btn">Go to Homepage</Link>
          <Link to="/products" className="ul-btn" style={{ background: 'transparent', border: '2px solid var(--ul-primary)', color: 'var(--ul-primary)' }}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
