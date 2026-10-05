import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Reveal, SplitText, Stagger, StaggerItem } from '../motion/Reveal';
import Tilt from '../motion/Tilt';
import Magnetic from '../motion/Magnetic';

import aboutImg from '../../assets/images/about-img.webp';
import aboutVector1 from '../../assets/images/about-img-vector-1.svg';
import aboutVector2 from '../../assets/images/about-img-vector-2.svg';
import aboutBgVector from '../../assets/images/about-vector-1.webp';

export default function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const vectorRotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  return (
    <section ref={ref} className="ul-about ul-section-spacing" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ul-container">
        <div className="row row-cols-lg-2 row-cols-1 align-items-center gy-5">
          {/* Image Side */}
          <div className="col">
            <Reveal from="zoom" duration={1.2}>
              <motion.div className="ul-about-imgs" style={{ y: imgY, position: 'relative' }}>
                <Tilt max={8} radius={28}>
                  <div className="img-wrapper" style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(19,25,29,0.18)' }}>
                    <img src={aboutImg} alt="About LetsShop" style={{ width: '100%', height: 'auto' }} />
                  </div>
                </Tilt>

                <motion.div className="ls-about-badge" style={{ y: badgeY }}>
                  <span className="big">100%</span>
                  <span className="small">Authentic Products</span>
                </motion.div>

                <motion.div className="ul-about-imgs-vectors d-none d-md-block" style={{ rotate: vectorRotate }}>
                  <img src={aboutVector1} alt="" className="vector-1" />
                  <img src={aboutVector2} alt="" className="vector-2" />
                </motion.div>
              </motion.div>
            </Reveal>
          </div>

          {/* Text Side */}
          <div className="col">
            <div className="ul-about-txt">
              <Reveal>
                <span className="ls-eyebrow">About LetsShop</span>
              </Reveal>
              <SplitText
                as="h2"
                className="ul-section-title"
                text="Your Trusted Online Shopping Destination"
                highlight={['Trusted']}
              />
              <Reveal delay={0.2}>
                <p className="ul-section-descr">
                  We bring you the best products at unbeatable prices. From electronics to fashion,
                  home essentials to sports — we've got everything you need, delivered fast and reliably.
                </p>
              </Reveal>

              <Stagger className="ls-about-features" gap={0.12}>
                {[
                  { icon: 'flaticon-love', title: 'Quality Guaranteed', text: '100% authentic products' },
                  { icon: 'flaticon-back', title: 'Easy Returns', text: 'Hassle-free refunds' },
                  { icon: 'flaticon-package', title: 'Fast Delivery', text: 'Across UAE & India' },
                ].map((f) => (
                  <StaggerItem key={f.title} className="ls-about-feature">
                    <span className="icon"><i className={f.icon}></i></span>
                    <div>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.3}>
                <div className="ul-about-bottom" style={{ marginTop: '36px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Magnetic>
                    <Link to="/about" className="ul-btn ls-btn-shine">
                      <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Learn More
                    </Link>
                  </Magnetic>
                  <div className="ul-about-call" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="icon ls-ring-pulse" style={{ width: '50px', height: '50px', background: 'var(--ul-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      <i className="flaticon-telephone-call"></i>
                    </div>
                    <div className="txt">
                      <span className="call-title" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ul-gray)', fontWeight: 600 }}>Call Any Time</span>
                      <a href="tel:+971501234567" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ul-black)' }}>+971 50 123 4567</a>
                    </div>
                  </div>
                </div>
              </Reveal>
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
