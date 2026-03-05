import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../api/products';

import electronicsImg from '../../assets/images/category-electronics.png';
import fashionImg from '../../assets/images/category-fashion.png';
import homeImg from '../../assets/images/category-home.png';
import sportsImg from '../../assets/images/category-sports.png';
import eventBg from '../../assets/images/donations-bg.png';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, laptops and more', image: electronicsImg },
  { id: 2, name: 'Fashion', slug: 'fashion', description: 'Fashion for men, women and kids', image: fashionImg },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Everything for your home', image: homeImg },
  { id: 4, name: 'Sports', slug: 'sports-outdoors', description: 'Gear up for your active lifestyle', image: sportsImg },
];

const IMG_FALLBACKS = [electronicsImg, fashionImg, homeImg, sportsImg];

export default function Categories() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    productAPI.getCategories()
      .then(data => {
        const rawCats = data.categories || data.data || (Array.isArray(data) ? data : []);
        const cats = rawCats.slice(0, 4).map((c) => {
          let image = IMG_FALLBACKS[0];
          const name = (c.name || '').toLowerCase();
          const slug = (c.slug || '').toLowerCase();
          
          if (name.includes('fashion') || slug.includes('fashion')) image = fashionImg;
          else if (name.includes('home') || slug.includes('kitchen') || slug.includes('home')) image = homeImg;
          else if (name.includes('sports') || slug.includes('sports')) image = sportsImg;
          
          return { ...c, image };
        });
        if (cats.length > 0) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="ul-events ul-section-spacing" style={{ position: 'relative' }}>
      <div className="ul-container">
        <div className="ul-section-heading justify-content-center text-center" style={{ marginBottom: '50px' }}>
          <div>
            <span className="ul-section-sub-title" style={{ background: 'rgba(235, 83, 16, 0.08)', color: 'var(--ul-primary)', padding: '6px 16px', borderRadius: '999px', display: 'inline-block', marginBottom: '12px' }}>
              Explore
            </span>
            <h2 className="ul-section-title">Shop By Category</h2>
          </div>
        </div>

        <div className="row row-cols-lg-2 row-cols-md-2 row-cols-1 ul-bs-row gy-4">
          {categories.map((cat, i) => (
            <div className="col" key={cat.id || i}>
              <div className="ul-event-item" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', background: '#fff' }}>
                <div className="ul-event-item-img" style={{ height: '240px' }}>
                  <img src={cat.image || IMG_FALLBACKS[i % IMG_FALLBACKS.length]} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="ul-event-item-content" style={{ padding: '30px' }}>
                  <div className="ul-event-item-txt">
                    <div className="top" style={{ marginBottom: '15px' }}>
                      <span className="ul-event-item-badge" style={{ background: 'var(--ul-gray3)', color: 'var(--ul-gray)', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px' }}>
                        <i className="flaticon-calendar" style={{ marginRight: '6px' }}></i>
                        Available Now
                      </span>
                    </div>
                    <h3 className="ul-event-item-title" style={{ marginBottom: '12px', fontSize: '1.4rem' }}>
                      <Link to={`/categories/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id}`}>
                        {cat.name}
                      </Link>
                    </h3>
                    <p className="ul-event-item-descr" style={{ color: 'var(--ul-gray)', marginBottom: '25px', lineHeight: 1.6 }}>{cat.description || `Browse our exclusive ${cat.name} collection`}</p>
                  </div>
                  <Link
                    to={`/categories/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id}`}
                    className="ul-btn ul-btn--sm"
                    style={{ padding: '10px 22px' }}
                  >
                    <i className="flaticon-fast-forward-double-right-arrows-symbol"></i> Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background vector */}
      <div className="ul-events-vectors d-none d-lg-block" style={{ backgroundImage: eventBg ? `url(${eventBg})` : 'none', opacity: 0.05 }} />
    </section>
  );
}
