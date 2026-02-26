import React, { useEffect, useState } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import PageBanner from '../components/layout/PageBanner';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { currency } = useOutletContext() || { currency: 'AED' };
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const activeCat = searchParams.get('category') || '';

  useEffect(() => {
    productAPI.getCategories()
      .then(d => {
        // Handle { categories: [...] } or { data: [...] } or [...] 
        const cats = d.categories || d.data || (Array.isArray(d) ? d : []);
        setCategories(cats);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCat) params.category_id = activeCat;
    if (search) params.search = search;

    productAPI.getProducts(params)
      .then(d => setProducts(d.data || d || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCat, search]);

  return (
    <main>
      <PageBanner title="Our Products" crumbs={[{ label: 'Products' }]} />

      <section className="ul-section-spacing">
        <div className="ul-container">
          {/* Search + Filter bar */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px', alignItems: 'center', background: 'var(--ul-c4)', padding: '24px', borderRadius: '16px' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
               <i className="flaticon-search" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ul-gray)' }}></i>
               <input
                type="search"
                placeholder="Search products by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '14px 20px 14px 48px',
                  borderRadius: '12px', border: '1.5px solid var(--ul-gray2)',
                  fontSize: '0.95rem', outline: 'none', background: '#fff',
                  fontFamily: 'var(--font-primary)',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--ul-gray2)'}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSearchParams({})}
                style={{
                  padding: '10px 22px', borderRadius: '999px',
                  background: !activeCat ? 'var(--ul-primary)' : '#fff',
                  color: !activeCat ? '#fff' : 'var(--ul-gray)',
                  border: '1.5px solid',
                  borderColor: !activeCat ? 'var(--ul-primary)' : 'var(--ul-gray2)',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >All</button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  style={{
                    padding: '10px 22px', borderRadius: '999px',
                    background: activeCat === String(cat.id) ? 'var(--ul-primary)' : '#fff',
                    color: activeCat === String(cat.id) ? '#fff' : 'var(--ul-gray)',
                    border: '1.5px solid',
                    borderColor: activeCat === String(cat.id) ? 'var(--ul-primary)' : 'var(--ul-gray2)',
                    fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >{cat.name}</button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
               <div style={{ width: '50px', height: '50px', margin: '0 auto 16px', border: '4px solid var(--ul-c3)', borderTopColor: 'var(--ul-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
               <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
               <p style={{ color: 'var(--ul-gray)', fontWeight: 600 }}>Loading latest products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px 20px', background: 'var(--ul-c4)', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, color: 'var(--ul-black)', marginBottom: '12px' }}>No items found matching your search.</h3>
              <p style={{ color: 'var(--ul-gray)' }}>Try adjusting your filters or category.</p>
              <button onClick={() => { setSearch(''); setSearchParams({}); }} className="ul-btn" style={{ marginTop: '24px' }}>Clear All Filters</button>
            </div>
          ) : (
            <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 row-cols-xxs-1 ul-bs-row">
              {products.map(product => (
                <div className="col" key={product.id}>
                  <ProductCard
                    product={product}
                    currency={currency}
                    onAddToCart={handleAddToCart}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
