import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import PageBanner from '../components/layout/PageBanner';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useOutletContext() || { currency: 'AED' };
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const fetchCategoryAndProducts = async () => {
      try {
        // Fetch categories to find the one matching slug
        const categoriesData = await productAPI.getCategories();
        const cats = categoriesData.categories || categoriesData.data || (Array.isArray(categoriesData) ? categoriesData : []);
        const found = cats.find(c => c.slug === slug || c.name.toLowerCase().replace(/\s+/g, '-') === slug);

        if (found) {
          setCategory(found);
          const productData = await productAPI.getProducts({ category_id: found.id });
          setProducts(productData.data || productData || []);
        } else {
          toast.error('Category not found');
        }
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

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

  return (
    <main>
      <PageBanner
        title={category ? category.name : 'Category'}
        crumbs={[
          { label: 'Products', to: '/products' },
          { label: category ? category.name : slug }
        ]}
      />

      <section className="ul-section-spacing">
        <div className="ul-container">
          {loading ? (
             <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div style={{ width: '50px', height: '50px', margin: '0 auto 16px', border: '4px solid var(--ul-c3)', borderTopColor: 'var(--ul-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: 'var(--ul-gray)', fontWeight: 600 }}>Loading category products...</p>
             </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px 20px', background: 'var(--ul-c4)', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
              <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, color: 'var(--ul-black)', marginBottom: '12px' }}>No products found in this category.</h3>
              <p style={{ color: 'var(--ul-gray)' }}>We're currently updating our stock for {category?.name || 'this category'}.</p>
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
