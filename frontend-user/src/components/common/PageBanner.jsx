import React from 'react';
import { Link } from 'react-router-dom';

const PageBanner = ({ title, breadcrumbs = [] }) => {
  return (
    <div
      className="ul-breadcrumb"
      style={{
        background: `linear-gradient(rgba(30,37,47,0.85), rgba(30,37,47,0.85)), url('/assets/img/breadcrumb-bg.jpg') no-repeat center center / cover`,
        padding: 'clamp(80px, 10vw, 150px) 0 clamp(50px, 6vw, 100px)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div className="ul-container">
        <h1 className="ul-breadcrumb-title">{title}</h1>
        {breadcrumbs.length > 0 && (
          <nav>
            <ul className="ul-breadcrumb-nav">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {i > 0 && <span className="separator" style={{ color: 'rgba(255,255,255,0.5)', margin: '0 4px' }}>›</span>}
                  {crumb.to ? (
                    <Link to={crumb.to} style={{ color: '#fff' }}>{crumb.label}</Link>
                  ) : (
                    <span style={{ color: 'var(--ul-primary)' }}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default PageBanner;
