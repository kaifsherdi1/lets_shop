import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '../ui/Icon';
import './Hero.css';

import fashionImg from '../../assets/images/hero-fashion.webp';
import homeImg from '../../assets/images/cat-home-v2.webp';
import sportsImg from '../../assets/images/cat-sports-v2.webp';
import laptopImg from '../../assets/images/promo/electronics.webp';
import beautyImg from '../../assets/images/promo/beauty.webp';

const SLIDES = [
  {
    eyebrow: 'New season · Fashion',
    title: 'Effortless style for every day',
    descr: 'Natural fabrics, easy silhouettes and wardrobe staples — curated pieces that look good and are made to last.',
    cta: { label: 'Shop fashion', to: '/categories/fashion' },
    secondary: { label: 'View all products', to: '/products' },
    img: fashionImg,
    alt: 'Woman in a linen dress walking through a summer meadow',
    theme: 'sage',
  },
  {
    eyebrow: 'Home & Kitchen',
    title: 'Make every room feel like home',
    descr: 'Furniture, décor and kitchen essentials, thoughtfully selected for calm, modern living.',
    cta: { label: 'Shop home', to: '/categories/home-kitchen' },
    secondary: { label: 'Browse all departments', to: '/products' },
    img: homeImg,
    alt: 'Bright open-plan living room and kitchen',
    theme: 'sand',
  },
  {
    eyebrow: 'Sports & Outdoors',
    title: 'Gear up. Train harder.',
    descr: 'Performance equipment and activewear for the gym, the trail and everything in between.',
    cta: { label: 'Shop sports', to: '/categories/sports-outdoors' },
    secondary: { label: 'View all products', to: '/products' },
    img: sportsImg,
    alt: 'Athlete training with a kettlebell in a modern gym',
    theme: 'ink',
  },
];

const TILES = [
  {
    label: 'Electronics',
    title: 'Laptops, audio & cameras',
    to: '/categories/electronics',
    img: laptopImg,
    theme: 'cool',
  },
  {
    label: 'Beauty & Personal Care',
    title: 'Fragrance & everyday care',
    to: '/categories/beauty-personal-care',
    img: beautyImg,
    theme: 'warm',
  },
];

const PERKS = [
  { icon: 'truck', title: 'Free delivery', text: 'On every order, UAE & India' },
  { icon: 'returns', title: '14-day returns', text: 'Hassle-free money back' },
  { icon: 'shield', title: 'Secure payments', text: 'Fully encrypted checkout' },
  { icon: 'headset', title: '24/7 support', text: 'Real people, ready to help' },
];

const SLIDE_MS = 7000;
const EASE = [0.16, 1, 0.3, 1];

const textVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const textItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  // The first slide paints immediately (it is the page's largest element, so
  // fading it in would delay the first meaningful paint); later slides animate.
  const firstPaint = useRef(true);
  useEffect(() => {
    firstPaint.current = false;
  }, []);
  const enter = (variant) => (firstPaint.current ? false : variant);

  const go = (i) => setCurrent((i + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[current];

  return (
    <section className="lshero" aria-label="Featured collections">
      <div className="lsh-container">
        <div className="lshero-grid">
          {/* ── Campaign slider ── */}
          <div
            className={`lshero-slider theme-${slide.theme}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            aria-roledescription="carousel"
          >
            <div className="lshero-stage">
            <AnimatePresence initial={false}>
              <motion.div
                key={current}
                className="lshero-slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                aria-roledescription="slide"
                aria-label={`${current + 1} of ${SLIDES.length}`}
              >
                <motion.div className="lshero-copy" variants={textVariants} initial={enter('hidden')} animate="show">
                  <motion.span className="lshero-eyebrow" variants={textItem}>{slide.eyebrow}</motion.span>
                  <motion.h1 className="lshero-title" variants={textItem}>{slide.title}</motion.h1>
                  <motion.p className="lshero-descr" variants={textItem}>{slide.descr}</motion.p>
                  <motion.div className="lshero-ctas" variants={textItem}>
                    <Link to={slide.cta.to} className="lshero-btn">
                      {slide.cta.label} <Icon name="arrowRight" size={18} />
                    </Link>
                    <Link to={slide.secondary.to} className="lshero-link">
                      {slide.secondary.label}
                    </Link>
                  </motion.div>
                </motion.div>

                <div className="lshero-media">
                  <motion.img
                    src={slide.img}
                    alt={slide.alt}
                    initial={enter({ scale: 1.12, clipPath: 'inset(0 0 0 100%)' })}
                    animate={{ scale: 1, clipPath: 'inset(0 0 0 0%)' }}
                    transition={{ duration: 1.1, ease: EASE }}
                    fetchPriority={current === 0 ? 'high' : undefined}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="lshero-controls">
              <span className="lshero-count">
                {String(current + 1).padStart(2, '0')} <i>/</i> {String(SLIDES.length).padStart(2, '0')}
              </span>
              <div className="lshero-bars">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    className={`lshero-bar${i === current ? ' active' : ''}${i < current ? ' done' : ''}`}
                    onClick={() => go(i)}
                    aria-label={`Show slide ${i + 1}: ${s.title}`}
                    aria-current={i === current}
                  >
                    {i === current && !reduceMotion && (
                      <span
                        key={current}
                        className="fill"
                        style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                        onAnimationEnd={() => go(current + 1)}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="lshero-arrows">
              <button type="button" onClick={() => go(current - 1)} aria-label="Previous slide">
                <Icon name="chevronLeft" size={20} />
              </button>
              <button type="button" onClick={() => go(current + 1)} aria-label="Next slide">
                <Icon name="chevronRight" size={20} />
              </button>
            </div>
          </div>

          {/* ── Promo tiles ── */}
          <div className="lshero-tiles">
            {TILES.map((t) => (
              <div key={t.label} style={{ minHeight: 0 }}>
                <Link to={t.to} className={`lshero-tile theme-${t.theme}`}>
                  <div className="lshero-tile-copy">
                    <span className="lshero-tile-label">{t.label}</span>
                    <b className="lshero-tile-title">{t.title}</b>
                    <span className="lshero-tile-cta">
                      Shop now <Icon name="arrowRight" size={16} />
                    </span>
                  </div>
                  <img src={t.img} alt="" className="lshero-tile-img" width="900" height="900" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Service promises ── */}
        <ul className="lshero-perks">
          {PERKS.map((p) => (
            <li key={p.title}>
              <span className="icon"><Icon name={p.icon} size={22} /></span>
              <span>
                <b>{p.title}</b>
                <small>{p.text}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
