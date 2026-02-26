import React, { useRef, useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { productAPI } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../product/ProductCard';
import toast from 'react-hot-toast';

import user1 from '../../assets/img/user-1.png';
import user2 from '../../assets/img/user-2.png';
import user3 from '../../assets/img/user-3.png';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);
  const { currency } = useOutletContext() || { currency: 'AED' };
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    productAPI.getProducts({ per_page: 8 })
      .then(data => setProducts(data.data || data || []))
      .catch(() => {});
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await addToCart(productId, 1);
      toast.success('Successfully added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth * 0.8;
    sliderRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="ul-donations ul-section-spacing overflow-hidden" style={{ background: '#fff' }}>
      <div className="ul-container">
        <div className="ul-section-heading ul-donations-heading d-flex flex-wrap align-items-end justify-content-between gy-4" style={{ marginBottom: '40px' }}>
          <div className="left">
            <span className="ul-section-sub-title" style={{ background: 'rgba(235, 83, 16, 0.08)', color: 'var(--ul-primary)', padding: '6px 16px', borderRadius: '999px', display: 'inline-block', marginBottom: '12px' }}>
              Our Selection
            </span>
            <h2 className="ul-section-title">Featured Products</h2>
          </div>

          <div className="d-none d-lg-block">
             <div className="ul-banner-stat" style={{ background: 'var(--ul-c4)', padding: '10px 20px', borderRadius: '999px' }}>
                <div className="imgs">
                  <img src={user1} alt="" />
                  <img src={user3} alt="" />
                  <img src={user2} alt="" />
                </div>
                <span className="txt" style={{ color: 'var(--ul-black)', fontWeight: 700 }}>5K+ Happy Customers</span>
             </div>
          </div>

          <div className="ul-slider-nav ul-donations-slider-nav d-none d-sm-flex">
            <button className="prev" onClick={() => scroll('left')} aria-label="Previous"><i className="flaticon-back"></i></button>
            <button className="next" onClick={() => scroll('right')} aria-label="Next"><i className="flaticon-next"></i></button>
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
            padding: '10px 5px 30px',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
          className="slider-track"
        >
          {products.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ flex: '0 0 280px', scrollSnapAlign: 'start' }}>
                  <div style={{ height: '400px', background: 'var(--ul-gray3)', borderRadius: '20px', animation: 'pulse 1.5s infinite' }} />
                </div>
              ))
            : products.map(product => (
                <div key={product.id} style={{
                  flex: '0 0 280px',
                  scrollSnapAlign: 'start',
                  maxWidth: 'calc(100vw - 60px)'
                }}>
                  <ProductCard
                    product={product}
                    currency={currency}
                    onAddToCart={handleAddToCart}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))
          }
        </div>
      </div>

      <div className="ul-container" style={{ textAlign: 'center' }}>
        <Link to="/products" className="ul-btn ul-btn--outline" style={{ border: '2px solid var(--ul-primary)', background: 'transparent', color: 'var(--ul-primary)' }}>
          <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> View All Products
        </Link>
      </div>
    </section>
  );
}
