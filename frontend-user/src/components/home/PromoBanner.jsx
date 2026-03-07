import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

export default function PromoBanner() {
  const [amount, setAmount] = useState('50');
  const [custom, setCustom] = useState('');
  const { currency } = useOutletContext() || { currency: 'AED' };

  return (
    <section className="ul-donate-form-section ul-section-spacing" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ul-container">
        <div className="ul-donate-form-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
          {/* Form Side */}
           <div className="ul-donate-form-box" style={{ flex: '1 1 450px', background: 'var(--ul-primary)', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 60px rgba(118, 176, 171, 0.2)' }}>
            <span className="ul-section-sub-title" style={{ color: '#fff', opacity: 0.9 }}>Value Plus</span>
            <h3 className="ul-donate-form-title" style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '30px' }}>Exclusive Membership Benefits</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: 'flaticon-delivery-truck', title: 'Free Global Shipping', desc: 'On orders over $100' },
                { icon: 'flaticon-love', title: '24/7 Priority Support', desc: 'Dedicated customer care' },
                { icon: 'flaticon-shield', title: 'Secure Payments', desc: 'Fully encrypted transactions' },
                { icon: 'flaticon-back', title: '30-Day Returns', desc: 'Hassle-free money back' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: '#fff' }}>
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0 }}>{item.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/register" className="ul-btn" style={{ width: '100%', background: 'var(--ul-black)', color: '#fff', justifyContent: 'center', height: '56px', marginTop: '30px' }}>
              <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Join The Club
            </Link>
          </div>

          {/* Text Side */}
          <div className="ul-donate-form-txt" style={{ flex: '1 1 400px' }}>
            <span className="ul-section-sub-title" style={{ background: 'rgba(118, 176, 171, 0.08)', color: 'var(--ul-primary)', padding: '6px 16px', borderRadius: '999px', display: 'inline-block', marginBottom: '12px' }}>
              Why Shop With Us
            </span>
            <h2 className="ul-section-title" style={{ marginBottom: '20px' }}>Premium Quality, Unbeatable Prices</h2>
            <p className="ul-section-descr" style={{ marginBottom: '32px', color: 'var(--ul-gray)', lineHeight: 1.8 }}>
              We offer a curated selection of high-quality products at competitive prices.
              Every purchase is backed by our guarantee of authenticity and fast delivery across UAE and India.
            </p>
            <Link to="/about" className="ul-btn ul-btn--outline" style={{ border: '2px solid var(--ul-primary)', background: 'transparent', color: 'var(--ul-primary)' }}>
              <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Learn Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
