import React from 'react';
import { Link } from 'react-router-dom';
import breadcrumbBg from '../../assets/images/breadcrumb-bg.jpg';

/**
 * PageBanner — template .ul-breadcrumb section used on every inner page.
 * Pass `bg` (an imported local image) to override the default backdrop.
 * Usage: <PageBanner title="About Us" crumbs={[{ label: 'About Us' }]} bg={aboutBanner} />
 */
export default function PageBanner({ title, crumbs = [], bg }) {
  const image = bg || breadcrumbBg;

  return (
    <section
      className="ul-breadcrumb ul-section-spacing"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(15,21,24,0.84) 0%, rgba(15,21,24,0.5) 38%, rgba(15,21,24,0.12) 100%), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        padding: '100px 0',
        color: '#fff',
      }}
    >
      <div className="ul-container">
        <h2 className="ul-breadcrumb-title" style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '15px' }}>{title}</h2>
        <ul className="ul-breadcrumb-nav" style={{ display: 'flex', gap: '10px', alignItems: 'center', listStyle: 'none', padding: 0 }}>
          <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link></li>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <li style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="separator"><i className="flaticon-next" style={{ fontSize: '0.8rem' }}></i></span>
              </li>
              <li style={{ color: 'var(--ul-primary)', fontWeight: 700 }}>
                {crumb.to ? <Link to={crumb.to} style={{ color: 'inherit', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
