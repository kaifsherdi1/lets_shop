import React from 'react';
import { Link } from 'react-router-dom';

const blogImg1 = '/assets/images/blog-1.jpg';
const blogImg2 = '/assets/images/blog-2.jpg';
const footerVector = '/assets/images/footer-vector-img.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ul-footer">
      {/* Footer Top — Contact Info Bar */}
      <div className="ul-footer-top" style={{ padding: '40px 0' }}>
        <div className="ul-footer-container">
          <div className="ul-footer-top-contact-infos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="ul-footer-top-contact-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="ul-footer-top-contact-info-icon" style={{ flexShrink: 0 }}>
                <div className="ul-footer-top-contact-info-icon-inner" style={{ width: '60px', height: '60px', background: 'rgba(235, 83, 16, 0.1)', color: 'var(--ul-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  <i className="flaticon-pin"></i>
                </div>
              </div>
              <div className="ul-footer-top-contact-info-txt">
                <span className="ul-footer-top-contact-info-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ul-gray)', fontWeight: 600, marginBottom: '4px' }}>Address</span>
                <h5 className="ul-footer-top-contact-info-address" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Dubai, UAE</h5>
              </div>
            </div>

            <div className="ul-footer-top-contact-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="ul-footer-top-contact-info-icon" style={{ flexShrink: 0 }}>
                <div className="ul-footer-top-contact-info-icon-inner" style={{ width: '60px', height: '60px', background: 'rgba(235, 83, 16, 0.1)', color: 'var(--ul-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  <i className="flaticon-email"></i>
                </div>
              </div>
              <div className="ul-footer-top-contact-info-txt">
                <span className="ul-footer-top-contact-info-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ul-gray)', fontWeight: 600, marginBottom: '4px' }}>Send Email</span>
                <h5 className="ul-footer-top-contact-info-address" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  <a href="mailto:info@letsshop.com">info@letsshop.com</a>
                </h5>
              </div>
            </div>

            <div className="ul-footer-top-contact-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="ul-footer-top-contact-info-icon" style={{ flexShrink: 0 }}>
                <div className="ul-footer-top-contact-info-icon-inner" style={{ width: '60px', height: '60px', background: 'rgba(235, 83, 16, 0.1)', color: 'var(--ul-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  <i className="flaticon-telephone-call-1"></i>
                </div>
              </div>
              <div className="ul-footer-top-contact-info-txt">
                <span className="ul-footer-top-contact-info-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ul-gray)', fontWeight: 600, marginBottom: '4px' }}>Call Us</span>
                <h5 className="ul-footer-top-contact-info-address" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  <a href="tel:+971501234567">+971 50 123 4567</a>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Middle */}
      <div className="ul-footer-middle" style={{ padding: '80px 0' }}>
        <div className="ul-footer-container">
          <div className="ul-footer-middle-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '50px' }}>
            <div className="ul-footer-about">
              <Link to="/" style={{ display: 'inline-block', marginBottom: '25px' }}>
                <span style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, fontSize: '1.8rem', color: '#fff' }}>
                  Lets<span style={{ color: 'var(--ul-primary)' }}>Shop</span>
                </span>
              </Link>
              <p className="ul-footer-about-txt" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '30px' }}>
                Your one-stop destination for quality products. Shop smarter, live better.
              </p>
              <div className="ul-footer-socials" style={{ display: 'flex', gap: '15px' }}>
                <a href="#" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><i className="flaticon-facebook"></i></a>
                <a href="#" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><i className="flaticon-twitter"></i></a>
                <a href="#" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><i className="flaticon-linkedin-big-logo"></i></a>
                <a href="#" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><i className="flaticon-youtube"></i></a>
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
                <Link to="/services/repair" style={{ color: 'rgba(255,255,255,0.7)' }}>Services</Link>
                <Link to="/contact" style={{ color: 'rgba(255,255,255,0.7)' }}>Contact Us</Link>
              </div>
            </div>

            <div className="ul-footer-widget">
              <h3 className="ul-footer-widget-title" style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '25px', position: 'relative', paddingBottom: '15px' }}>
                Newsletter
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: 'var(--ul-primary)' }}></span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>Subscribe to get latest updates and offers.</p>
              <form onSubmit={e => e.preventDefault()} className="ul-nwsltr-form" style={{ position: 'relative' }}>
                <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '15px 60px 15px 20px', borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                <button type="submit" style={{ position: 'absolute', right: '5px', top: '5px', width: '45px', height: '45px', borderRadius: '50%', background: 'var(--ul-primary)', color: '#fff', border: 'none' }}><i className="flaticon-next"></i></button>
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
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Terms &amp; Conditions</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Privacy Policy</a>
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
