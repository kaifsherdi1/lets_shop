import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-bg)' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '8rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: '8px' }}>
          404
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--primary-dark)', margin: '0 0 12px' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '380px', margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
