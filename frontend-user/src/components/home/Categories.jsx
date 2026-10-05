import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../api/products';

import electronicsImg from '../../assets/images/category-electronics.webp';
import fashionImg from '../../assets/images/category-fashion.webp';
import homeImg from '../../assets/images/category-home.webp';
import sportsImg from '../../assets/images/category-sports.webp';
import { resolveProductImage } from '../../utils/image';
import { Reveal, SplitText, Stagger, StaggerItem } from '../motion/Reveal';
import Tilt from '../motion/Tilt';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, laptops and more', image: electronicsImg },
  { id: 2, name: 'Fashion', slug: 'fashion', description: 'Fashion for men, women and kids', image: fashionImg },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Everything for your home', image: homeImg },
  { id: 4, name: 'Sports', slug: 'sports-outdoors', description: 'Gear up for your active lifestyle', image: sportsImg },
];

const localImageFor = (c) => {
  const key = `${c.name || ''} ${c.slug || ''}`.toLowerCase();
  if (key.includes('fashion')) return fashionImg;
  if (key.includes('home') || key.includes('kitchen')) return homeImg;
  if (key.includes('sport') || key.includes('outdoor')) return sportsImg;
  return electronicsImg;
};

export default function Categories() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    productAPI.getCategories()
      .then(data => {
        const rawCats = data.categories || data.data || (Array.isArray(data) ? data : []);
        const cats = rawCats.slice(0, 4).map((c) => ({
          ...c,
          image: (c.image && resolveProductImage(c.image)) || localImageFor(c),
          localImage: localImageFor(c),
        }));
        if (cats.length > 0) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="categories" className="ul-events ul-section-spacing ls-cats" style={{ position: 'relative' }}>
      <div className="ul-container">
        <div className="ul-section-heading justify-content-center text-center" style={{ marginBottom: '50px' }}>
          <div>
            <Reveal><span className="ls-eyebrow">Explore</span></Reveal>
            <SplitText as="h2" className="ul-section-title" text="Shop By Category" highlight={['Category']} />
          </div>
        </div>

        <Stagger className="row row-cols-xl-4 row-cols-md-2 row-cols-1 ul-bs-row gy-4" gap={0.12}>
          {categories.map((cat, i) => {
            const to = `/categories/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id}`;
            return (
              <StaggerItem className="col" key={cat.id || i}>
                <Tilt max={10} radius={26}>
                  <Link to={to} className="ls-cat-card">
                    <img
                      src={cat.image || cat.localImage}
                      alt={cat.name}
                      className="ls-cat-img"
                      loading="lazy"
                      onError={(e) => {
                        if (cat.localImage && e.target.src !== cat.localImage) e.target.src = cat.localImage;
                      }}
                    />
                    <span className="ls-cat-shade" />
                    <span className="ls-cat-index">0{i + 1}</span>
                    <div className="ls-cat-body">
                      <span className="ls-cat-badge">Available Now</span>
                      <h3 className="ls-cat-title">{cat.name}</h3>
                      <p className="ls-cat-descr">{cat.description || `Browse our exclusive ${cat.name} collection`}</p>
                      <span className="ls-cat-cta">
                        Shop Now <span className="arrow">→</span>
                      </span>
                    </div>
                  </Link>
                </Tilt>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
