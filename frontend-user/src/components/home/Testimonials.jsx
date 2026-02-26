import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const testimonialAvatar1 = '/assets/images/member-1.jpg';
const testimonialAvatar2 = '/assets/images/member-2.jpg';
const testimonialAvatar3 = '/assets/images/member-3.jpg';
const testimonialAvatar4 = '/assets/images/member-4.jpg';

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

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);

  function goTo(idx) {
    if (!sliderRef.current) return;
    setCurrent(idx);
    const itemWidth = sliderRef.current.querySelector('.ul-testimonial-item')?.offsetWidth || sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({ left: idx * (itemWidth + 24), behavior: 'smooth' });
  }

  function prev() {
    const next = (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    goTo(next);
  }

  function next() {
    const n = (current + 1) % TESTIMONIALS.length;
    goTo(n);
  }

  return (
    <section className="ul-testimonial-2 ul-section-spacing" style={{ background: 'var(--ul-c4)' }}>
      <div className="ul-container">
        <div className="ul-testimonial-2-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          {/* Rating Overview Card */}
          <div className="ul-testimonial-2-left" style={{ flex: '1 1 320px' }}>
            <div className="ul-testimonial-2-rating-overview" style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              <div className="top" style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 className="number" style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--ul-primary)' }}>4.9</h3>
                <div className="stars" style={{ color: '#FFB800', fontSize: '1.2rem', margin: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <i key={s} className="flaticon-star"></i>
                  ))}
                </div>
                <span className="txt" style={{ fontSize: '0.9rem', color: 'var(--ul-gray)', fontWeight: 700 }}>Average Rating</span>
              </div>

              <div className="progress-bars" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div className="progress-bar-item" key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="star" style={{ minWidth: '12px', fontSize: '0.85rem', fontWeight: 700 }}>{star}</span>
                    <i className="flaticon-star" style={{ color: '#FFB800', fontSize: '0.8rem' }}></i>
                    <div className="bar" style={{ flex: 1, height: '6px', background: '#F0F0F0', borderRadius: '3px', position: 'relative' }}>
                      <span className="fill" style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--ul-primary)', borderRadius: '3px', width: ['92%', '60%', '20%', '8%', '3%'][i] }}></span>
                    </div>
                    <span className="percent" style={{ minWidth: '35px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ul-gray)', textAlign: 'right' }}>{['92', '60', '20', '8', '3'][i]}%</span>
                  </div>
                ))}
              </div>

              <Link to="/products" className="ul-btn" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Shop Now
              </Link>
            </div>
          </div>

          {/* Testimonials Slider */}
          <div className="ul-testimonial-2-right" style={{ flex: '1 1 500px', overflow: 'hidden' }}>
            <div className="ul-section-heading d-flex flex-wrap align-items-center justify-content-between gy-3">
              <div className="left">
                <span className="ul-section-sub-title" style={{ background: 'rgba(235, 83, 16, 0.08)', color: 'var(--ul-primary)', padding: '6px 16px', borderRadius: '999px', display: 'inline-block', marginBottom: '12px' }}>
                  Testimonials
                </span>
                <h2 className="ul-section-title">What Our Customers Say</h2>
              </div>
              <div className="ul-slider-nav d-none d-sm-flex">
                <button className="prev" onClick={prev} aria-label="Previous"><i className="flaticon-back"></i></button>
                <button className="next" onClick={next} aria-label="Next"><i className="flaticon-next"></i></button>
              </div>
            </div>

            <div
              ref={sliderRef}
              style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                marginTop: '24px',
                WebkitOverflowScrolling: 'touch',
                padding: '10px 5px 30px',
              }}
              className="slider-track"
            >
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.id}
                  className="ul-testimonial-item"
                  style={{
                    flex: '0 0 100%',
                    scrollSnapAlign: 'start',
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '30px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column'
                   }}
                >
                  <div className="ul-testimonial-item-txt" style={{ flex: 1 }}>
                    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--ul-black)', lineHeight: 1.6, marginBottom: '24px' }}>&ldquo;{t.text}&rdquo;</p>
                  </div>
                  <div className="ul-testimonial-item-author" style={{ borderTop: '1px solid #F0F0F0', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="img" style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="txt">
                      <h4 className="name" style={{ fontWeight: 800, color: 'var(--ul-black)', marginBottom: '2px' }}>{t.name}</h4>
                      <span className="role" style={{ fontSize: '0.85rem', color: 'var(--ul-gray)', display: 'block', marginBottom: '5px' }}>{t.role}</span>
                      <div className="stars" style={{ color: '#FFB800', fontSize: '0.8rem' }}>
                        {Array.from({ length: 5 }).map((_, si) => (
                          <i key={si} className={`flaticon-star${si < t.rating ? '' : '-1'}`} style={{ marginRight: '2px' }}></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'center' }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === current ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: i === current ? 'var(--ul-primary)' : '#D0D0D0',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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
