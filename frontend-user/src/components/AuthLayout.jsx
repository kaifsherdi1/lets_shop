import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--ul-c4) 0%, #fff5ee 50%, var(--ul-c3) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-primary)',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(235,83,16,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(250,160,25,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        padding: 'clamp(32px, 5vw, 48px)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span style={{
              fontFamily: 'var(--font-quicksand)',
              fontWeight: 800,
              fontSize: '1.8rem',
              color: 'var(--ul-primary)',
              letterSpacing: '-0.03em',
            }}>
              Lets<span style={{ color: 'var(--ul-black)' }}>Shop</span>
            </span>
          </Link>

          {title && (
            <h1 style={{
              fontFamily: 'var(--font-quicksand)',
              fontWeight: 700,
              fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
              color: 'var(--ul-black)',
              margin: '16px 0 6px',
              letterSpacing: '-0.03em',
            }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ color: 'var(--ul-gray)', fontSize: '0.9rem', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Top accent line */}
        <div style={{
          height: '3px',
          background: 'var(--ul-gradient)',
          borderRadius: '999px',
          marginBottom: '28px',
        }} />

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
