import React from 'react';

export default function InfoSection() {
  const stats = [
    { icon: 'flaticon-costumer', number: '5,000+', label: 'Happy Customers' },
    { icon: 'flaticon-package', number: '1,200+', label: 'Products Available' },
    { icon: 'flaticon-team', number: '50+', label: 'Expert Team Members' },
    { icon: 'flaticon-relationship', number: '30+', label: 'Delivery Destinations' },
  ];

  return (
    <div className="ul-stats ul-section-spacing" style={{ background: 'var(--ul-c4)' }}>
      <div className="ul-container">
        <div className="ul-stats-wrapper" style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 row-cols-xxs-1 ul-bs-row justify-content-center gy-4">
            {stats.map((stat, i) => (
              <div className="col" key={i}>
                <div className="ul-stats-item" style={{ background: '#fff', padding: '30px 20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%', transition: 'transform 0.3s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2.5rem', color: 'var(--ul-primary)', marginBottom: '15px' }}>
                    <i className={stat.icon}></i>
                  </div>
                  <span className="number" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ul-black)', display: 'block', marginBottom: '5px' }}>{stat.number}</span>
                  <span className="txt" style={{ fontSize: '0.9rem', color: 'var(--ul-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
