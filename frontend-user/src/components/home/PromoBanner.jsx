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
          <div className="ul-donate-form-box" style={{ flex: '1 1 450px', background: 'var(--ul-primary)', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 60px rgba(235, 83, 16, 0.2)' }}>
            <span className="ul-section-sub-title" style={{ color: '#fff', opacity: 0.9 }}>Value Deals</span>
            <h3 className="ul-donate-form-title" style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '30px' }}>Select Your Shopping Credit</h3>

            <form onSubmit={e => e.preventDefault()} className="ul-donate-form ul-form">
              <div className="ul-donate-form-amounts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginBottom: '25px' }}>
                {['25', '50', '100', '200'].map(val => (
                  <button
                    key={val}
                    type="button"
                    className={amount === val ? 'active' : ''}
                    onClick={() => { setAmount(val); setCustom(''); }}
                    style={{
                      background: amount === val ? '#fff' : 'rgba(255,255,255,0.1)',
                      color: amount === val ? 'var(--ul-primary)' : '#fff',
                      border: 'none', padding: '12px', borderRadius: '12px',
                      fontWeight: 700, transition: 'all 0.3s ease',
                    }}
                  >
                    {currency} {val}
                  </button>
                ))}
              </div>

              <div className="ul-donate-form-custom" style={{ marginBottom: '30px' }}>
                <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Or enter custom amount</label>
                <div className="form-input-wrapper" style={{ position: 'relative' }}>
                  <span className="currency-symbol" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--ul-primary)' }}>{currency}</span>
                  <input
                    type="number"
                    placeholder="Enter custom value"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setAmount(''); }}
                    min="1"
                    style={{ width: '100%', padding: '14px 16px 14px 60px', borderRadius: '14px', border: 'none', fontSize: '1rem', color: 'var(--ul-black)', fontWeight: 700 }}
                  />
                </div>
              </div>

              <Link to="/products" className="ul-btn" style={{ width: '100%', background: 'var(--ul-black)', color: '#fff', justifyContent: 'center', height: '56px' }}>
                <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Claim This Credit
              </Link>
            </form>
          </div>

          {/* Text Side */}
          <div className="ul-donate-form-txt" style={{ flex: '1 1 400px' }}>
            <span className="ul-section-sub-title" style={{ background: 'rgba(235, 83, 16, 0.08)', color: 'var(--ul-primary)', padding: '6px 16px', borderRadius: '999px', display: 'inline-block', marginBottom: '12px' }}>
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
