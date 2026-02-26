import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PageBanner — template .ul-breadcrumb section used on every inner page
 * Usage: <PageBanner title="About Us" crumbs={[{ label: 'About Us' }]} />
 */
export default function PageBanner({ title, crumbs = [] }) {
  return (
    <section className="ul-breadcrumb ul-section-spacing">
      <div className="ul-container">
        <h2 className="ul-breadcrumb-title">{title}</h2>
        <ul className="ul-breadcrumb-nav">
          <li><Link to="/">Home</Link></li>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <li>
                <span className="separator"><i className="flaticon-right"></i></span>
              </li>
              <li>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
