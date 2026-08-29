import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/layout/PageBanner';

import aboutBanner from '../assets/images/about-banner.jpg';
import aboutImg from '../assets/images/about-img.png';
import missionImg from '../assets/images/about-expert.png';
import member1 from '../assets/images/member-1.png';
import member2 from '../assets/images/member-2.png';
import member3 from '../assets/images/member-3.png';
import member4 from '../assets/images/member-4.png';

const TEAM = [
  { img: member1, name: 'David Wilson', role: 'Founder & CEO' },
  { img: member2, name: 'Sarah Johnson', role: 'Head of Operations' },
  { img: member3, name: 'Michael Chen', role: 'Lead Developer' },
  { img: member4, name: 'Emma Williams', role: 'Customer Experience' },
];

const svg = (size, ...paths) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const Ic = {
  spark: svg(11, <path key="a" d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />),
  shield: svg(26, <path key="a" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />, <path key="b" d="M9 12l2 2 4-4" />),
  truck: svg(26, <path key="a" d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />, <circle key="b" cx="7" cy="18" r="1.6" />, <circle key="c" cx="17.5" cy="18" r="1.6" />),
  refresh: svg(26, <path key="a" d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2" />, <path key="b" d="M18 3v4h-4M6 21v-4h4" />),
  bag: svg(24, <path key="a" d="M6 8h12l-1 12H7L6 8z" />, <path key="b" d="M9 8V6a3 3 0 0 1 6 0v2" />),
  box: svg(24, <path key="a" d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />),
  users: svg(24, <path key="a" d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />, <circle key="b" cx="9" cy="8" r="3.5" />, <path key="c" d="M21 20v-2a4 4 0 0 0-3-3.8M16 4.2a4 4 0 0 1 0 7.6" />),
  pin: svg(24, <path key="a" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />, <circle key="b" cx="12" cy="10" r="3" />),
};

const VALUES = [
  {
    icon: Ic.shield,
    title: '100% Authentic',
    text: 'Every product is sourced from verified sellers and quality-checked before it ships.',
  },
  {
    icon: Ic.truck,
    title: 'Fast Delivery',
    text: 'Reliable shipping across the UAE and India, with tracking on every order.',
  },
  {
    icon: Ic.refresh,
    title: 'Easy Returns',
    text: 'Changed your mind? Return eligible items within 14 days — no hassle, no fine print.',
  },
];

const STATS = [
  { icon: Ic.bag, num: '5,000+', label: 'Orders Delivered' },
  { icon: Ic.box, num: '1,200+', label: 'Products Listed' },
  { icon: Ic.users, num: '50+', label: 'Team Members' },
  { icon: Ic.pin, num: '2', label: 'Countries Served' },
];

const TAB_CONTENT = {
  Mission: {
    text: 'To make quality products accessible to everyone, everywhere. Every person deserves the best products at fair prices, delivered with genuine care.',
    points: [
      'Offer the widest selection of authentic products',
      'Ensure fast, reliable delivery to every doorstep',
      'Keep the shopping experience simple and enjoyable',
    ],
  },
  Vision: {
    text: 'A world where shopping is effortless, transparent and delightful. We combine technology with a passion for service to become the most trusted marketplace in the region.',
    points: [
      'Become the #1 trusted e-commerce platform in MENA',
      'Connect millions of customers with top-quality products',
      'Set new standards for customer satisfaction',
    ],
  },
  History: {
    text: 'Founded in 2020 as a small store with a big dream, LetsShop has grown into a thriving marketplace with thousands of products and a loyal customer base across two countries.',
    points: [
      '2020 — Founded with 50 products and 3 team members',
      '2022 — Grew to 500+ products and 5,000 customers',
      '2024 — Launched in the UAE and India',
    ],
  },
};
const TABS = Object.keys(TAB_CONTENT);

const S = {
  section: { padding: 'clamp(56px, 7vw, 96px) 0' },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(118,176,171,0.1)',
    color: 'var(--ul-primary)',
    padding: '6px 16px',
    borderRadius: 999,
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  h2: {
    fontFamily: 'var(--font-quicksand)',
    fontWeight: 800,
    fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
    lineHeight: 1.2,
    color: 'var(--ul-black)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  lead: { color: '#54606a', fontSize: '1.02rem', lineHeight: 1.8 },
};

function Eyebrow({ children }) {
  return (
    <span style={S.eyebrow}>
      {Ic.spark}
      {children}
    </span>
  );
}

export default function About() {
  const [tab, setTab] = useState('Mission');
  const active = TAB_CONTENT[tab];

  return (
    <main>
      <PageBanner title="About Us" crumbs={[{ label: 'About Us' }]} bg={aboutBanner} />

      {/* ── Intro ─────────────────────────────────────────────── */}
      <section style={{ ...S.section, background: '#fff' }}>
        <div className="ul-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'center',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px -20px rgba(19,25,29,0.28)',
                  aspectRatio: '4 / 3.4',
                }}
              >
                <img
                  src={aboutImg}
                  alt="The LetsShop team preparing customer orders"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -18,
                  bottom: -18,
                  width: 110,
                  height: 110,
                  borderRadius: 24,
                  background: 'var(--ul-primary)',
                  opacity: 0.14,
                  zIndex: -1,
                }}
              />
            </div>

            {/* Text */}
            <div>
              <Eyebrow>Who We Are</Eyebrow>
              <h2 style={{ ...S.h2, marginBottom: 18 }}>Your trusted online shopping partner</h2>
              <p style={{ ...S.lead, marginBottom: 24 }}>
                LetsShop was built with one goal — to make quality products accessible to everyone. We
                source the best items across every category, from electronics to fashion, and bring
                them directly to your door.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'grid', gap: 12 }}>
                {[
                  'Curated, verified products only',
                  'Transparent pricing in AED and INR',
                  'Support that actually responds',
                ].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'rgba(118,176,171,0.15)',
                        color: 'var(--ul-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ color: 'var(--ul-black)', fontWeight: 600 }}>{t}</span>
                  </li>
                ))}
              </ul>
              <Link to="/products" className="ul-btn">
                <i className="flaticon-fast-forward-double-right-arrows-symbol" /> Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section style={{ ...S.section, background: 'var(--ul-c4)' }}>
        <div className="ul-container">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto clamp(36px, 5vw, 56px)' }}>
            <Eyebrow>What We Stand For</Eyebrow>
            <h2 style={S.h2}>Shopping should be simple and fair</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.title}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '34px 28px',
                  border: '1px solid var(--ul-gray2)',
                  transition: 'transform .3s ease, box-shadow .3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 22px 45px -18px rgba(19,25,29,0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(118,176,171,0.12)',
                    color: 'var(--ul-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-quicksand)',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: 'var(--ul-black)',
                    margin: '0 0 8px',
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ color: '#54606a', lineHeight: 1.7, margin: 0, fontSize: '0.94rem' }}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section style={{ ...S.section, background: '#fff' }}>
        <div className="ul-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 20,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'var(--ul-c4)',
                  border: '1px solid var(--ul-gray2)',
                  borderRadius: 20,
                  padding: '30px 18px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    margin: '0 auto 14px',
                    borderRadius: 14,
                    background: 'rgba(118,176,171,0.12)',
                    color: 'var(--ul-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-quicksand)',
                    fontWeight: 800,
                    fontSize: '1.9rem',
                    color: 'var(--ul-black)',
                    marginBottom: 4,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: '0.76rem',
                    color: '#54606a',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission / Vision / History ────────────────────────── */}
      <section style={{ ...S.section, background: 'var(--ul-c4)' }}>
        <div className="ul-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 56px)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                aspectRatio: '4 / 3.4',
                boxShadow: '0 30px 60px -24px rgba(19,25,29,0.28)',
              }}
            >
              <img
                src={missionImg}
                alt="LetsShop operations team at work"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div>
              <Eyebrow>Our Purpose</Eyebrow>
              <h2 style={{ ...S.h2, marginBottom: 20 }}>Built on a clear set of goals</h2>

              <div
                style={{
                  display: 'inline-flex',
                  background: '#fff',
                  border: '1px solid var(--ul-gray2)',
                  borderRadius: 999,
                  padding: 4,
                  marginBottom: 22,
                  gap: 4,
                  flexWrap: 'wrap',
                }}
              >
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      padding: '9px 20px',
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all .25s ease',
                      background: tab === t ? 'var(--ul-primary)' : 'transparent',
                      color: tab === t ? '#fff' : '#54606a',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ minHeight: 210 }}>
              <p style={{ ...S.lead, marginBottom: 20 }}>{active.text}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {active.points.map((p) => (
                  <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--ul-primary)',
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ color: 'var(--ul-black)', lineHeight: 1.6 }}>{p}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section style={{ ...S.section, background: '#fff' }}>
        <div className="ul-container">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto clamp(36px, 5vw, 56px)' }}>
            <Eyebrow>Our Team</Eyebrow>
            <h2 style={S.h2}>The people behind LetsShop</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 24,
            }}
          >
            {TEAM.map((m) => (
              <div
                key={m.name}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid var(--ul-gray2)',
                  background: '#fff',
                  transition: 'transform .3s ease, box-shadow .3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 24px 45px -18px rgba(19,25,29,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ aspectRatio: '3 / 3.4', overflow: 'hidden' }}>
                  <img
                    src={m.img}
                    alt={m.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '18px 16px', textAlign: 'center' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-quicksand)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: 'var(--ul-black)',
                      margin: '0 0 2px',
                    }}
                  >
                    {m.name}
                  </h3>
                  <span style={{ color: 'var(--ul-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {m.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 clamp(60px, 8vw, 100px)', background: '#fff' }}>
        <div className="ul-container">
          <div
            style={{
              borderRadius: 28,
              padding: 'clamp(44px, 7vw, 80px) clamp(24px, 5vw, 60px)',
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              background:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 45%), linear-gradient(135deg, #1c4541 0%, #2f6c66 55%, #76b0ab 130%)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Get Started
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-quicksand)',
                fontWeight: 800,
                fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              Ready to start shopping?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', margin: '0 auto 28px', maxWidth: 520 }}>
              Join thousands of happy customers and discover great products at fair prices today.
            </p>
            <Link
              to="/products"
              className="ul-btn"
              style={{ background: 'var(--ul-black)', color: '#fff', border: 'none' }}
            >
              <i className="flaticon-fast-forward-double-right-arrows-symbol" /> Browse Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
