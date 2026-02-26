import React, { useState } from 'react';
import PageBanner from '../components/layout/PageBanner';

const aboutImg = '/assets/images/about-img.png';
const aboutBlockImg = '/assets/images/about-block-img.jpg';
const aboutVector1 = '/assets/images/about-img-vector-1.svg';
const aboutVector2 = '/assets/images/about-img-vector-2.svg';
const team1 = '/assets/images/member-1.jpg';
const team2 = '/assets/images/member-2.jpg';
const team3 = '/assets/images/member-3.jpg';
const team4 = '/assets/images/member-4.jpg';
const ctaBg = '/assets/img/cta-bg.jpg';
const whyJoin = '/assets/images/why-join.jpg';

const TEAM = [
  { id: 1, img: team1, name: 'David Wilson', role: 'Founder & CEO' },
  { id: 2, img: team2, name: 'Sarah Johnson', role: 'Head of Operations' },
  { id: 3, img: team3, name: 'Michael Chen', role: 'Lead Developer' },
  { id: 4, img: team4, name: 'Emma Williams', role: 'Customer Experience' },
];

const TABS = ['Mission', 'Vision', 'History'];

export default function About() {
  const [activeTab, setActiveTab] = useState('Mission');

  const tabContent = {
    Mission: {
      heading: 'Our Mission',
      text: 'Our mission is to make quality products accessible to everyone, everywhere. We believe every person deserves access to the best products at fair prices, delivered with exceptional customer service.',
      points: [
        'Offer the widest selection of authentic products',
        'Ensure fast and reliable delivery to every corner',
        'Make the shopping experience simple and enjoyable',
      ],
    },
    Vision: {
      heading: 'Our Vision',
      text: 'We envision a world where shopping is effortless, transparent, and delightful. By leveraging technology and passion for service, we aim to be the most trusted online marketplace in the region.',
      points: [
        'Become the #1 trusted e-commerce platform in MENA',
        'Connect millions of customers with top-quality products',
        'Set new standards for customer satisfaction',
      ],
    },
    History: {
      heading: 'Our History',
      text: "Founded in 2020, LetsShop started as a small online store with a big dream. Today, we've grown into a thriving marketplace with thousands of products and a loyal customer base across the region.",
      points: [
        '2020 — Founded with 50 products and 3 team members',
        '2022 — Expanded to 500+ products and 5,000 customers',
        '2024 — Launched in UAE and India with 10,000+ happy customers',
      ],
    },
  };

  const content = tabContent[activeTab];

  return (
    <main>
      <PageBanner title="About Us" crumbs={[{ label: 'About Us' }]} />

      {/* About section */}
      <section className="ul-about ul-section-spacing">
        <div className="ul-container">
          <div className="row row-cols-md-2 row-cols-1 align-items-center gy-4">
            <div className="col">
              <div className="ul-about-imgs">
                <div className="img-wrapper">
                  <img src={aboutImg} alt="About Us" />
                </div>
                <div className="ul-about-imgs-vectors">
                  <img src={aboutVector1} alt="" className="vector-1" />
                  <img src={aboutVector2} alt="" className="vector-2" />
                </div>
              </div>
            </div>
            <div className="col">
              <div className="ul-about-txt">
                <span className="ul-section-sub-title ul-section-sub-title--2">Who We Are</span>
                <h2 className="ul-section-title">Your Trusted Online Shopping Partner</h2>
                <p className="ul-section-descr">
                  LetsShop was built with one goal — to make quality products accessible to everyone.
                  We source the best items across all categories, from electronics to fashion, and bring them
                  directly to your door.
                </p>
                <div className="ul-about-block">
                  <div className="block-left">
                    <div className="block-heading">
                      <div className="icon"><i className="flaticon-love"></i></div>
                      <h3 className="block-title">Customer First</h3>
                    </div>
                    <ul className="block-list">
                      <li>100% authentic, verified products</li>
                      <li>Hassle-free returns and refunds</li>
                    </ul>
                  </div>
                  <div className="block-right">
                    <img src={aboutBlockImg} alt="About" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="ul-stats ul-section-spacing pt-0">
        <div className="ul-container">
          <div className="ul-stats-wrapper">
            <div className="row row-cols-md-4 row-cols-2">
              {[
                { icon: 'flaticon-costumer', num: '5,000+', label: 'Happy Customers' },
                { icon: 'flaticon-package', num: '1,200+', label: 'Products' },
                { icon: 'flaticon-team', num: '50+', label: 'Team Members' },
                { icon: 'flaticon-relationship', num: '30+', label: 'Destinations' },
              ].map((s, i) => (
                <div className="col" key={i}>
                  <div className="ul-stats-item">
                    <i className={s.icon}></i>
                    <span className="number">{s.num}</span>
                    <span className="txt">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Vision / History Tabs */}
      <section className="ul-about-tabs ul-section-spacing">
        <div className="ul-container">
          <div className="row row-cols-md-2 row-cols-1 gy-4 align-items-start">
            <div className="col">
              <img src={whyJoin} alt="About" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', maxHeight: '450px' }} />
            </div>
            <div className="col">
              <div className="ul-tab">
                <div className="ul-tab-nav">
                  {TABS.map(tab => (
                    <button
                      key={tab}
                      className={`ul-tab-btn${activeTab === tab ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="ul-tab-content">
                  <h3 style={{ fontWeight: 800, marginBottom: '12px', color: 'var(--ul-black)' }}>{content.heading}</h3>
                  <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '16px' }}>{content.text}</p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {content.points.map((p, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--ul-primary)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                        <span style={{ color: '#555' }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="ul-team ul-section-spacing pt-0">
        <div className="ul-container">
          <div className="ul-section-heading justify-content-center text-center" style={{ marginBottom: '40px' }}>
            <div>
              <span className="ul-section-sub-title">Our Team</span>
              <h2 className="ul-section-title">Meet The People Behind LetsShop</h2>
            </div>
          </div>
          <div className="row row-cols-md-4 row-cols-2 row-cols-xxs-1 ul-bs-row">
            {TEAM.map(member => (
              <div className="col" key={member.id}>
                <div className="ul-team-member">
                  <div className="ul-team-member-img">
                    <img src={member.img} alt={member.name} />
                    <div className="ul-team-member-socials">
                      <a href="#"><i className="flaticon-facebook"></i></a>
                      <a href="#"><i className="flaticon-twitter"></i></a>
                      <a href="#"><i className="flaticon-linkedin-big-logo"></i></a>
                    </div>
                  </div>
                  <div className="ul-team-member-txt">
                    <h4 className="ul-team-member-name">{member.name}</h4>
                    <span className="ul-team-member-role">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ul-cta ul-section-spacing" style={{ backgroundImage: `url(${ctaBg})` }}>
        <div className="ul-container">
          <div className="ul-cta-wrapper text-center">
            <span className="ul-section-sub-title">Get Started</span>
            <h2 className="ul-section-title ul-cta-title">Ready to Start Shopping?</h2>
            <p className="ul-cta-descr">Join thousands of happy customers and discover amazing products today.</p>
            <a href="/products" className="ul-btn">
              <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Browse Products
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
