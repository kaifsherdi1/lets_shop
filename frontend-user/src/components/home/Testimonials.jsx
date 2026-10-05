import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal, SplitText, EASE } from '../motion/Reveal';
import Tilt from '../motion/Tilt';

import testimonialAvatar1 from '../../assets/images/user-1.webp';
import testimonialAvatar2 from '../../assets/images/user-2.webp';
import testimonialAvatar3 from '../../assets/images/user-3.webp';
import testimonialAvatar4 from '../../assets/images/user-4.webp';

const TESTIMONIALS = [
  {
    id: 1, avatar: testimonialAvatar1,
    name: 'Sarah Johnson', role: 'Regular Customer',
    rating: 5,
    text: 'Absolutely love shopping here! The products are high quality and delivery was super fast. Will definitely order again.',
  },
  {
    id: 2, avatar: testimonialAvatar2,
    name: 'Michael Chen', role: 'Verified Buyer',
    rating: 5,
    text: 'Great selection of products and amazing customer service. The checkout process is seamless and my order arrived on time.',
  },
  {
    id: 3, avatar: testimonialAvatar3,
    name: 'Emma Williams', role: 'Loyal Shopper',
    rating: 4,
    text: 'I\'ve been shopping here for months now and I\'m always impressed by the quality and value. Highly recommend!',
  },
  {
    id: 4, avatar: testimonialAvatar4,
    name: 'Ahmed Al-Rashid', role: 'Premium Member',
    rating: 5,
    text: 'Best online shopping experience I\'ve had. The website is easy to use, prices are fair, and delivery is reliable.',
  },
];

const BARS = [92, 60, 20, 8, 3];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIALS.length;

  const goTo = (idx) => setCurrent((idx + count) % count);
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => setCurrent((c) => (c + 1) % count), 6000);
    return () => clearTimeout(t);
  }, [current, paused, count]);

  return (
    <section className="ul-testimonial-2 ul-section-spacing" style={{ background: 'var(--ul-c4)', overflow: 'hidden' }}>
      <div className="ul-container">
        <div className="ul-testimonial-2-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center' }}>
          {/* Rating overview */}
          <Reveal from="right" style={{ flex: '1 1 320px' }}>
            <Tilt max={7} radius={24}>
              <div className="ls-rating-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h3 className="ls-rating-number ls-depth">4.9</h3>
                  <div style={{ color: '#FFB800', fontSize: '1.2rem', margin: '8px 0' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i key={s} className="flaticon-star"></i>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--ul-gray)', fontWeight: 700 }}>Average Rating</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[5, 4, 3, 2, 1].map((star, i) => (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ minWidth: '12px', fontSize: '0.85rem', fontWeight: 700 }}>{star}</span>
                      <i className="flaticon-star" style={{ color: '#FFB800', fontSize: '0.8rem' }}></i>
                      <div style={{ flex: 1, height: '6px', background: '#F0F0F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.span
                          style={{ display: 'block', height: '100%', background: 'var(--ul-gradient)', borderRadius: '3px' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${BARS[i]}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: EASE }}
                        />
                      </div>
                      <span style={{ minWidth: '35px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ul-gray)', textAlign: 'right' }}>{BARS[i]}%</span>
                    </div>
                  ))}
                </div>

                <Link to="/products" className="ul-btn ls-btn-shine" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Shop Now
                </Link>
              </div>
            </Tilt>
          </Reveal>

          {/* 3D testimonial deck */}
          <div style={{ flex: '1 1 500px', minWidth: 0 }}>
            <div className="ul-section-heading d-flex flex-wrap align-items-center justify-content-between gy-3">
              <div className="left">
                <Reveal><span className="ls-eyebrow">Testimonials</span></Reveal>
                <SplitText as="h2" className="ul-section-title" text="What Our Customers Say" highlight={['Customers']} />
              </div>
              <div className="d-none d-sm-flex" style={{ gap: '10px' }}>
                <button type="button" className="ls-round-btn" onClick={prev} aria-label="Previous testimonial">
                  <i className="flaticon-back"></i>
                </button>
                <button type="button" className="ls-round-btn" onClick={next} aria-label="Next testimonial">
                  <i className="flaticon-next"></i>
                </button>
              </div>
            </div>

            <div
              className="ls-deck"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {TESTIMONIALS.map((t, i) => {
                const pos = (i - current + count) % count; // 0 = front
                const isFront = pos === 0;
                return (
                  <motion.article
                    key={t.id}
                    className="ls-deck-card"
                    aria-hidden={!isFront}
                    animate={{
                      y: pos * -22,
                      z: -pos * 80,
                      rotateX: pos * -4,
                      scale: 1 - pos * 0.05,
                      opacity: pos > 2 ? 0 : 1 - pos * 0.18,
                      filter: `blur(${pos * 1.2}px)`,
                    }}
                    transition={{ duration: 0.8, ease: EASE }}
                    style={{ zIndex: count - pos, pointerEvents: isFront ? 'auto' : 'none' }}
                    drag={isFront ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -80) next();
                      else if (info.offset.x > 80) prev();
                    }}
                    whileDrag={{ rotateZ: 0, cursor: 'grabbing' }}
                  >
                    <span className="ls-deck-quote" aria-hidden="true">&ldquo;</span>
                    <p className="ls-deck-text">{t.text}</p>
                    <div className="ls-deck-author">
                      <img src={t.avatar} alt={t.name} />
                      <div>
                        <h4>{t.name}</h4>
                        <span className="role">{t.role}</span>
                        <div style={{ color: '#FFB800', fontSize: '0.8rem' }}>
                          {Array.from({ length: 5 }).map((_, si) => (
                            <i key={si} className={`flaticon-star${si < t.rating ? '' : '-1'}`} style={{ marginRight: '2px' }}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '30px', justifyContent: 'center' }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: i === current ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: i === current ? 'var(--ul-primary)' : '#D0D0D0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
