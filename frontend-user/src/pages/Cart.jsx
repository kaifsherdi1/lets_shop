import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import MainLayout from '../components/layout/MainLayout';
import PageBanner from '../components/layout/PageBanner';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { currency } = useOutletContext() || { currency: 'AED' };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, newQty);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = currency === 'INR' ? item.product?.price_inr : item.product?.price_aed;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <MainLayout>
      <PageBanner
        title="Shopping Cart"
        crumbs={[{ label: 'Cart' }]}
      />

      <section className="ul-section-spacing">
        <div className="ul-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ul-gray)' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto 16px', border: '4px solid var(--ul-c3)', borderTopColor: 'var(--ul-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Loading cart...
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '24px' }}>🛒</span>
              <h2 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '12px' }}>Your Cart is Empty</h2>
              <p style={{ color: 'var(--ul-gray)', marginBottom: '28px' }}>Add some products to get started!</p>
              <Link to="/products" className="ul-btn">Browse Products</Link>
            </div>
          ) : (
            <div className="row ul-bs-row align-items-start">
              {/* Cart Items */}
              <div className="col-lg-8 col-12">
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--ul-gray3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', margin: 0, fontSize: '1.2rem' }}>
                      Cart Items ({items.length})
                    </h2>
                    <span style={{ color: 'var(--ul-gray)', fontSize: '0.85rem' }}>
                      {items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </span>
                  </div>

                  {items.map((item, idx) => {
                    const price = currency === 'INR' ? item.product?.price_inr : item.product?.price_aed;
                    const subtotalItem = price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex', gap: '20px', padding: '20px 24px', alignItems: 'center',
                          borderBottom: idx < items.length - 1 ? '1px solid var(--ul-gray3)' : 'none',
                          transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--ul-c4)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Image */}
                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--ul-gray3)', flexShrink: 0, overflow: 'hidden' }}>
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🛍️</div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link to={`/products/${item.product_id}`} style={{ fontWeight: 700, color: 'var(--ul-black)', fontSize: '0.95rem', display: 'block', marginBottom: '4px', textDecoration: 'none' }}>
                            {item.product?.name}
                          </Link>
                          <span style={{ color: 'var(--ul-primary)', fontWeight: 800 }}>
                            {formatCurrency(price, currency)}
                          </span>
                        </div>

                        {/* Qty stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--ul-gray2)', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={{ width: '36px', height: '36px', background: 'var(--ul-gray3)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            −
                          </button>
                          <span style={{ width: '36px', textAlign: 'center', fontWeight: 800, color: 'var(--ul-black)', fontSize: '0.95rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '36px', height: '36px', background: 'var(--ul-gray3)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontWeight: 800, color: 'var(--ul-black)', display: 'block' }}>
                            {formatCurrency(subtotalItem, currency)}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          style={{
                            width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                            background: '#fff0f0', cursor: 'pointer', color: '#e53e3e',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', flexShrink: 0, transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#e53e3e'; e.currentTarget.children[0].style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff0f0'; e.currentTarget.children[0].style.color = '#e53e3e'; }}
                        >
                          <span>✕</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4 col-12">
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '28px', position: 'sticky', top: '90px' }}>
                  <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '24px', fontSize: '1.15rem', paddingBottom: '16px', borderBottom: '2px solid var(--ul-c3)' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ul-gray)' }}>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(subtotal, currency)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ul-gray)' }}>Shipping</span>
                      <span style={{ fontWeight: 700, color: '#38a169' }}>Free</span>
                    </div>
                    <div style={{ height: '1px', background: 'var(--ul-gray3)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, color: 'var(--ul-black)', fontSize: '1.05rem' }}>Total</span>
                      <span style={{ fontWeight: 800, color: 'var(--ul-primary)', fontSize: '1.15rem' }}>{formatCurrency(subtotal, currency)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="ul-btn"
                    style={{ width: '100%', height: '52px', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    Proceed to Checkout →
                  </button>
                  <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '14px', color: 'var(--ul-gray)', fontSize: '0.9rem', fontWeight: 600 }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Cart;
