import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import breadcrumbBg from '../../assets/images/breadcrumb-bg.webp';
import { SplitText, EASE } from '../motion/Reveal';

/**
 * PageBanner — template .ul-breadcrumb section used on every inner page.
 * Pass `bg` (an imported local image) to override the default backdrop.
 * Usage: <PageBanner title="About Us" crumbs={[{ label: 'About Us' }]} bg={aboutBanner} />
 */
export default function PageBanner({ title, crumbs = [], bg }) {
  const image = bg || breadcrumbBg;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="ul-breadcrumb ul-section-spacing"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '90px 0 80px',
        color: '#fff',
        background: '#0e1417',
        isolation: 'isolate',
      }}
    >
      <motion.div
        aria-hidden="true"
        initial={{ scale: 1.25 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 2.4, ease: EASE }}
        style={{
          position: 'absolute',
          inset: '-10% 0 -10% 0',
          y: bgY,
          zIndex: -2,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background:
            'linear-gradient(90deg, rgba(14,20,23,0.9) 0%, rgba(14,20,23,0.55) 40%, rgba(14,20,23,0.15) 100%), linear-gradient(0deg, rgba(14,20,23,0.6) 0%, transparent 40%)',
        }}
      />

      <motion.div className="ul-container" style={{ y: contentY, opacity: contentOpacity }}>
        <SplitText
          as="h2"
          inView={false}
          delay={0.45}
          className="ul-breadcrumb-title"
          style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '15px' }}
          text={title}
        />
        <motion.ul
          className="ul-breadcrumb-nav"
          style={{ display: 'flex', gap: '10px', alignItems: 'center', listStyle: 'none', padding: '8px 18px', margin: '0 auto', width: 'fit-content', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
        >
          <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link></li>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <li style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="separator"><i className="flaticon-next" style={{ fontSize: '0.7rem' }}></i></span>
              </li>
              <li style={{ color: 'var(--ul-primary)', fontWeight: 700 }}>
                {crumb.to ? <Link to={crumb.to} style={{ color: 'inherit', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
              </li>
            </React.Fragment>
          ))}
        </motion.ul>
      </motion.div>

      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, transformOrigin: 'left', background: 'linear-gradient(90deg, #76b0ab, transparent)' }}
      />
    </section>
  );
}
