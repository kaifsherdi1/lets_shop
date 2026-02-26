import React from 'react';
import { Link } from 'react-router-dom';

const aboutImg = '/assets/images/about-img.png';
const aboutVector1 = '/assets/images/about-img-vector-1.svg';
const aboutVector2 = '/assets/images/about-img-vector-2.svg';
const aboutBlockImg = '/assets/images/about-block-img.jpg';
const aboutBgVector = '/assets/img/about-vector-1.png';

export default function AboutSection() {
  return (
    <section className="ul-about ul-section-spacing" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ul-container">
        <div className="row row-cols-lg-2 row-cols-1 align-items-center gy-5">
          {/* Image Side */}
          <div className="col">
            <div className="ul-about-imgs">
              <div className="img-wrapper" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
                <img src={aboutImg} alt="About Us" style={{ width: '100%', height: 'auto', transition: 'transform 0.5s ease' }} />
              </div>
              <div className="ul-about-imgs-vectors d-none d-md-block">
                <img src={aboutVector1} alt="" className="vector-1" />
                <img src={aboutVector2} alt="" className="vector-2" />
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="col">
            <div className="ul-about-txt">
              <span className="ul-section-sub-title ul-section-sub-title--2">About LetsShop</span>
              <h2 className="ul-section-title">Your Trusted Online Shopping Destination</h2>
              <p className="ul-section-descr">
                We bring you the best products at unbeatable prices. From electronics to fashion,
                home essentials to sports — we've got everything you need, delivered fast and reliably.
              </p>

              <div className="ul-about-block" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div className="block-left" style={{ flex: '1 1 250px' }}>
                  <div className="block-heading">
                    <div className="icon" style={{ background: 'rgba(235, 83, 16, 0.1)', color: 'var(--ul-primary)' }}>
                      <i className="flaticon-love"></i>
                    </div>
                    <h3 className="block-title">Quality Guaranteed</h3>
                  </div>
                  <ul className="block-list" style={{ marginTop: '12px' }}>
                    <li style={{ marginBottom: '8px' }}>100% authentic products</li>
                    <li>Easy returns & refunds</li>
                  </ul>
                </div>
                <div className="block-right d-none d-sm-block" style={{ flex: '0 0 120px' }}>
                  <img src={aboutBlockImg} alt="" style={{ borderRadius: '12px', width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <div className="ul-about-bottom" style={{ marginTop: '32px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/about" className="ul-btn">
                  <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Learn More
                </Link>
                <div className="ul-about-call" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div className="icon" style={{ width: '50px', height: '50px', background: 'var(--ul-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    <i className="flaticon-telephone-call"></i>
                  </div>
                  <div className="txt">
                    <span className="call-title" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ul-gray)', fontWeight: 600 }}>Call Any Time</span>
                    <a href="tel:+971501234567" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ul-black)' }}>+971 50 123 4567</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ul-about-vectors d-none d-xl-block">
        <img src={aboutBgVector} alt="" className="vector-1" />
      </div>
    </section>
  );
}
