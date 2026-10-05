import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal, SplitText, Stagger, StaggerItem } from '../motion/Reveal';
import Tilt from '../motion/Tilt';
import Magnetic from '../motion/Magnetic';

const BENEFITS = [
  { icon: 'flaticon-package', title: 'Free Delivery', desc: 'On every order, UAE & India' },
  { icon: 'flaticon-love', title: '24/7 Priority Support', desc: 'Dedicated customer care' },
  { icon: 'flaticon-checked', title: 'Secure Payments', desc: 'Fully encrypted transactions' },
  { icon: 'flaticon-back', title: '14-Day Returns', desc: 'Hassle-free money back' },
];

export default function PromoBanner() {
  return (
    <section className="ul-donate-form-section ul-section-spacing" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ul-container">
        <div className="ul-donate-form-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center' }}>
          {/* Membership card */}
          <Reveal from="flip" duration={1.1} style={{ flex: '1 1 450px' }}>
            <Tilt max={6} scale={1.01} radius={32}>
              <div className="ls-promo-card">
                <span className="ls-promo-glow" aria-hidden="true" />
                <span className="ul-section-sub-title" style={{ color: '#fff', opacity: 0.9 }}>Value Plus</span>
                <h3 className="ls-promo-title ls-depth">Exclusive Membership Benefits</h3>

                <Stagger gap={0.1} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {BENEFITS.map((item) => (
                    <StaggerItem key={item.title} className="ls-promo-item">
                      <span className="icon"><i className={item.icon}></i></span>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>

                <Link to="/register" className="ul-btn ls-btn-shine ls-promo-btn">
                  <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Join The Club
                </Link>
              </div>
            </Tilt>
          </Reveal>

          {/* Text side */}
          <div className="ul-donate-form-txt" style={{ flex: '1 1 400px' }}>
            <Reveal><span className="ls-eyebrow">Why Shop With Us</span></Reveal>
            <SplitText
              as="h2"
              className="ul-section-title"
              style={{ marginBottom: '20px' }}
              text="Premium Quality, Unbeatable Prices"
              highlight={['Unbeatable']}
            />
            <Reveal delay={0.15}>
              <p className="ul-section-descr" style={{ marginBottom: '32px', color: 'var(--ul-gray)', lineHeight: 1.8 }}>
                We offer a curated selection of high-quality products at competitive prices.
                Every purchase is backed by our guarantee of authenticity and fast delivery across UAE and India.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <Magnetic>
                <Link to="/about" className="ul-btn ul-btn--outline" style={{ border: '2px solid var(--ul-primary)', background: 'transparent', color: '#fff' }}>
                  <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Learn Our Story
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
