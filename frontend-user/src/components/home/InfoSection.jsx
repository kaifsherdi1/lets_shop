import React from 'react';

export default function InfoSection() {
  const stats = [
    { icon: 'flaticon-costumer', number: '5,000+', label: 'Happy Customers' },
    { icon: 'flaticon-package', number: '1,200+', label: 'Products Available' },
    { icon: 'flaticon-team', number: '50+', label: 'Expert Support' },
    { icon: 'flaticon-fast-delivery', number: '30+', label: 'Service Hubs' },
  ];

  return (
    <div className="ul-stats ul-section-spacing" style={{ background: '#fff' }}>
      <div className="ul-container">
        <div className="ul-stats-wrapper" style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 row-cols-xxs-1 ul-bs-row justify-content-center gy-4">
            {stats.map((stat, i) => (
              <div className="col" key={i}>
                <div 
                  className="ul-stats-item" 
                  style={{ 
                    background: 'var(--ul-c4)', 
                    padding: '40px 20px', 
                    borderRadius: '24px', 
                    border: '1px solid var(--ul-gray2)',
                    height: '100%', 
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textAlign: 'center'
                  }} 
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.borderColor = 'var(--ul-primary)';
                  }} 
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--ul-gray2)';
                  }}
                >
                  <div style={{ fontSize: '3rem', color: 'var(--ul-primary)', marginBottom: '20px' }}>
                    <i className={stat.icon}></i>
                  </div>
                  <span className="number" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--ul-black)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-quicksand)' }}>{stat.number}</span>
                  <span className="txt" style={{ fontSize: '0.85rem', color: 'var(--ul-gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
