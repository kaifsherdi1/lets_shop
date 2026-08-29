import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import footerVector from '../../assets/images/footer-vector-img.png';
import BrandMark from './BrandMark';

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setEmail('');
    toast.success('Thanks for subscribing!');
  };

  return (
    <footer className="ul-footer">
      {/* Footer Top — Contact Info Bar */}
      <div className="ul-footer-top" style={{ padding: '40px 0' }}>
        <div className="ul-footer-container">
          <div
            className="ul-footer-top-contact-infos"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}
          >
            {[
              { icon: <IconPin />, label: 'Address', value: 'Dubai, UAE' },
              { icon: <IconMail />, label: 'Send Email', value: 'info@letsshop.com', href: 'mailto:info@letsshop.com' },
              { icon: <IconPhone />, label: 'Call Us', value: '+971 50 123 4567', href: 'tel:+971501234567' },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: 'var(--ul-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 600,
                      marginBottom: '3px',
                    }}
                  >
                    {c.label}
                  </span>
                  <h5 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                    {c.href ? (
                      <a href={c.href} style={{ color: '#fff' }}>{c.value}</a>
                    ) : (
                      c.value
                    )}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Middle */}
      <div className="ul-footer-middle" style={{ padding: '80px 0' }}>
        <div className="ul-footer-container">
          <div className="ul-footer-middle-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '50px' }}>
            <div className="ul-footer-about">
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                <BrandMark size={35} />
                <span style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, fontSize: '1.6rem', color: '#fff', letterSpacing: '-0.02em' }}>
                  Lets<span style={{ color: 'var(--ul-primary)' }}>Shop</span>
                </span>
              </Link>
              <p className="ul-footer-about-txt" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '30px' }}>
                Your one-stop destination for quality products. Shop smarter, live better.
              </p>
              <div className="ul-footer-socials" style={{ display: 'flex', gap: '15px' }}>
                {[
                  { icon: 'flaticon-facebook', href: 'https://facebook.com', label: 'Facebook' },
                  { icon: 'flaticon-twitter', href: 'https://twitter.com', label: 'Twitter' },
                  { icon: 'flaticon-linkedin-big-logo', href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: 'flaticon-youtube', href: 'https://youtube.com', label: 'YouTube' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                  >
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="ul-footer-widget">
              <h3 className="ul-footer-widget-title" style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '25px', position: 'relative', paddingBottom: '15px' }}>
                Quick Links
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: 'var(--ul-primary)' }}></span>
              </h3>
              <div className="ul-footer-widget-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link>
                <Link to="/about" style={{ color: 'rgba(255,255,255,0.7)' }}>About Us</Link>
                <Link to="/products" style={{ color: 'rgba(255,255,255,0.7)' }}>Products</Link>
                <Link to="/services/repair" style={{ color: 'rgba(255,255,255,0.7)' }}>Repair &amp; Service</Link>
                <Link to="/contact" style={{ color: 'rgba(255,255,255,0.7)' }}>Contact Us</Link>
              </div>
            </div>

            <div className="ul-footer-widget">
              <h3 className="ul-footer-widget-title" style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '25px', position: 'relative', paddingBottom: '15px' }}>
                Newsletter
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: 'var(--ul-primary)' }}></span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>Subscribe to get latest updates and offers.</p>
              <form onSubmit={handleSubscribe} className="ul-nwsltr-form" style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address for newsletter"
                  style={{ width: '100%', padding: '15px 60px 15px 20px', borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
                <button type="submit" aria-label="Subscribe" style={{ position: 'absolute', right: '5px', top: '5px', width: '45px', height: '45px', borderRadius: '50%', background: 'var(--ul-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}><i className="flaticon-next"></i></button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="ul-footer-bottom" style={{ padding: '25px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="ul-footer-container">
          <div className="ul-footer-bottom-wrapper" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <p className="copyright-txt" style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>&copy; {year} LetsShop. All rights reserved.</p>
            <div className="ul-footer-bottom-nav" style={{ display: 'flex', gap: '25px' }}>
              <Link to="/terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Terms &amp; Conditions</Link>
              <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="ul-footer-vectors d-none d-xl-block">
        <img src={footerVector} alt="" className="ul-footer-vector-1" />
      </div>
    </footer>
  );
}

const svgProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function IconPin() {
  return (
    <svg {...svgProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg {...svgProps}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}
