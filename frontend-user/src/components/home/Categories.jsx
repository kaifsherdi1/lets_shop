import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../api/products';

const event1 = '/assets/images/donation-1.jpg';
const event2 = '/assets/images/donation-2.jpg';
const event3 = '/assets/images/donation-3.jpg';
const event4 = '/assets/images/donation-4.jpg';
const eventBg = '/assets/img/donations-bg.png';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Electronics', description: 'Gadgets, phones, laptops and more', image: event1 },
  { id: 2, name: 'Clothing', description: 'Fashion for men, women and kids', image: event2 },
  { id: 3, name: 'Home & Kitchen', description: 'Everything for your home', image: event3 },
  { id: 4, name: 'Sports', description: 'Gear up for your active lifestyle', image: event4 },
];

const IMG_FALLBACKS = [event1, event2, event3, event4];

export default function Categories() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    productAPI.getCategories()
      .then(data => {
        const rawCats = data.categories || data.data || (Array.isArray(data) ? data : []);
        const cats = rawCats.slice(0, 4).map((c, i) => ({
          ...c,
          image: IMG_FALLBACKS[i % IMG_FALLBACKS.length],
        }));
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
