import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { productAPI } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import MainLayout from '../components/layout/MainLayout';
import PageBanner from '../components/layout/PageBanner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { currency } = useOutletContext() || { currency: 'AED' };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productAPI.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '160px 0', color: 'var(--ul-gray)' }}>
          <div style={{ width: '50px', height: '50px', margin: '0 auto 16px', border: '4px solid var(--ul-c3)', borderTopColor: 'var(--ul-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading product...
        </div>
      </MainLayout>
    );
  }

  if (!product) return null;

  const price = currency === 'INR' ? product.price_inr : product.price_aed;
  const inStock = product.stock_quantity > 0;

  return (
    <MainLayout>
      <PageBanner
        title={product.name}
        crumbs={[
          { to: '/products', label: 'Products' },
          { label: product.name },
        ]}
      />

      <section className="ul-section-spacing">
        <div className="ul-container">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: 'var(--ul-gray)', fontWeight: 600, marginBottom: '32px',
              border: 'none', cursor: 'pointer',
              padding: '8px 16px', borderRadius: '999px',
              background: 'var(--ul-gray3)', transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ul-c3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ul-gray3)'}
          >
            ← Back to Products
          </button>

          <div className="row ul-bs-row align-items-start">
            {/* Image */}
            <div className="col-lg-6 col-12">
              <div style={{
                background: 'var(--ul-gray3)', borderRadius: '20px',
                overflow: 'hidden', aspectRatio: '1/1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '6rem', opacity: 0.4 }}>🛍️</div>
                )}
                {product.category?.name && (
                  <span style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'var(--ul-primary)', color: '#fff',
                    padding: '6px 16px', borderRadius: '999px',
                    fontSize: '0.8rem', fontWeight: 700,
                  }}>
                    {product.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="col-lg-6 col-12">
              <div style={{ padding: 'clamp(0px, 2vw, 20px)' }}>
                <h1 style={{
                  fontFamily: 'var(--font-quicksand)', fontWeight: 800,
                  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'var(--ul-black)',
                  letterSpacing: '-0.04em', marginBottom: '12px',
                }}>
                  {product.name}
                </h1>

                {product.sku && (
                  <p style={{ color: 'var(--ul-gray)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    SKU: <strong>{product.sku}</strong>
                  </p>
                )}

                {/* Price */}
                <div style={{
                  background: 'var(--ul-c4)', borderRadius: '12px',
                  padding: '20px', marginBottom: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ color: 'var(--ul-gray)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>Price</span>
                    <span style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--ul-primary)' }}>
                      {formatCurrency(price, currency)}
                    </span>
                  </div>
                  <span style={{
                    padding: '8px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem',
                    background: inStock ? '#e6ffed' : '#fff5f5',
                    color: inStock ? '#276749' : '#c53030',
                  }}>
                    {inStock ? `✓ In Stock (${product.stock_quantity})` : '✗ Out of Stock'}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--ul-black)', marginBottom: '10px', fontSize: '1rem' }}>
                      Product Description
                    </h3>
                    <p style={{ color: 'var(--ul-gray)', lineHeight: 1.8 }}>{product.description}</p>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                {inStock && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <label style={{ fontWeight: 700, color: 'var(--ul-black)' }}>Quantity:</label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--ul-gray2)', borderRadius: '12px', overflow: 'hidden' }}>
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          style={{
                            width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--ul-gray3)', border: 'none', cursor: 'pointer',
                            fontWeight: 700, fontSize: '1.2rem', color: quantity <= 1 ? 'var(--ul-gray2)' : 'var(--ul-black)',
                          }}
                        >
                          −
                        </button>
                        <span style={{ width: '48px', textAlign: 'center', fontWeight: 800, color: 'var(--ul-black)' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                          disabled={quantity >= product.stock_quantity}
                          style={{
                            width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--ul-gray3)', border: 'none', cursor: 'pointer',
                            fontWeight: 700, fontSize: '1.2rem', color: quantity >= product.stock_quantity ? 'var(--ul-gray2)' : 'var(--ul-black)',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px' }}>
                      <button
                        onClick={handleAddToCart}
                        className="ul-btn"
                        style={{ flex: 1, height: '52px', fontSize: '1rem' }}
                      >
                        Add to Cart
                      </button>
                      <Link
                        to="/cart"
                        style={{
                          flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid var(--ul-primary)', borderRadius: '999px',
                          color: 'var(--ul-primary)', fontWeight: 700, fontSize: '1rem',
                        }}
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProductDetail;
