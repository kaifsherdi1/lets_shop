import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { productAPI } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import useAddToCart from '../../hooks/useAddToCart';
import ProductCard from '../product/ProductCard';
import { motion } from 'framer-motion';
import { Reveal, SplitText, EASE } from '../motion/Reveal';

import Icon from '../ui/Icon';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const sliderRef = useRef(null);
  const { currency } = useOutletContext() || { currency: 'AED' };
  const { isAuthenticated } = useAuth();

  const load = useCallback(() => {
    setStatus('loading');
    productAPI.getProducts({ per_page: 8 })
      .then((data) => {
        setProducts(data.data || data || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddToCart = useAddToCart();

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth * 0.8;
    sliderRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="ls-featured ul-section-spacing">
      <div className="ul-container">
        <div className="ls-shelf-head">
          <div>
            <Reveal><span className="ls-eyebrow">Our selection</span></Reveal>
            <SplitText as="h2" className="ul-section-title" text="Featured products" />
            <p className="ls-shelf-sub">The newest arrivals across every department.</p>
          </div>
          <div className="ls-shelf-tools">
            <Link to="/products" className="ls-shelf-all">
              View all <Icon name="arrowRight" size={16} />
            </Link>
            <div className="ls-shelf-nav d-none d-sm-flex">
              <button type="button" onClick={() => scroll('left')} aria-label="Scroll products left">
                <Icon name="chevronLeft" size={20} />
              </button>
              <button type="button" onClick={() => scroll('right')} aria-label="Scroll products right">
                <Icon name="chevronRight" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ul-container">
        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            padding: '8px 8px 40px',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
          className="slider-track"
        >
          {status === 'error' ? (
            <div className="ls-shelf-empty" role="alert">
              <p>We couldn't load products right now.</p>
              <button type="button" onClick={load}>Try again</button>
            </div>
          ) : status === 'ready' && products.length === 0 ? (
            <div className="ls-shelf-empty">
              <p>New products are on their way — check back soon.</p>
            </div>
          ) : status === 'loading'
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ flex: '0 0 280px', scrollSnapAlign: 'start' }}>
                  <div style={{ height: '400px', background: 'var(--ul-gray3)', borderRadius: '20px', animation: 'ls-skeleton 1.4s ease-in-out infinite' }} />
                </div>
              ))
            : products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 80, rotateY: -25 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: Math.min(i, 4) * 0.09, ease: EASE }}
                  style={{
                    flex: '0 0 280px',
                    scrollSnapAlign: 'start',
                    maxWidth: 'calc(100vw - 60px)',
                    transformPerspective: 1200,
                  }}
                >
                  <ProductCard
                    product={product}
                    currency={currency}
                    onAddToCart={handleAddToCart}
                    isAuthenticated={isAuthenticated}
                  />
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
