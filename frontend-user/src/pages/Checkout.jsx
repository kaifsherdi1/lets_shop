import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { orderAPI } from '../api/orders';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import MainLayout from '../components/layout/MainLayout';
import PageBanner from '../components/layout/PageBanner';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { currency, setCurrency } = useOutletContext() || { currency: 'AED', setCurrency: () => {} };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    delivery_address: '',
    payment_method: 'cod',
    currency: currency || 'AED',
  });

  useEffect(() => {
    if (currency) {
      setFormData(prev => ({ ...prev, currency }));
    }
  }, [currency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.delivery_address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    setLoading(true);
    try {
      await orderAPI.placeOrder(formData);
      await refreshCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];

  const calcTotal = (curr) => items.reduce((sum, item) => {
    const price = curr === 'INR' ? item.product?.price_inr : item.product?.price_aed;
    return sum + (parseFloat(price) * item.quantity);
  }, 0);

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid var(--ul-gray2)', borderRadius: '10px',
    fontSize: '0.95rem', fontFamily: 'var(--font-primary)',
    outline: 'none', transition: 'border-color 0.3s ease',
    boxSizing: 'border-box', background: '#fff',
  };

  return (
    <MainLayout>
      <PageBanner
        title="Checkout"
        crumbs={[{ to: '/cart', label: 'Cart' }, { label: 'Checkout' }]}
      />

      <section className="ul-section-spacing">
        <div className="ul-container">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ color: 'var(--ul-gray)', marginBottom: '20px' }}>Your cart is empty.</p>
              <Link to="/products" className="ul-btn">Browse Products</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row ul-bs-row align-items-start">
                {/* Left: Form */}
                <div className="col-lg-7 col-12">
                  {/* Delivery Section */}
                  <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '28px', marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '24px', fontSize: '1.1rem', paddingBottom: '14px', borderBottom: '2px solid var(--ul-c3)' }}>
                      📍 Delivery Address
                    </h3>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Full Address *
                      </label>
                      <textarea
                        required
                        value={formData.delivery_address}
                        onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                        placeholder="Enter your complete delivery address including city, state, pincode..."
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--ul-gray2)'}
                      />
                    </div>
                  </div>

                  {/* Currency Section */}
                  <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '28px', marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '20px', fontSize: '1.1rem', paddingBottom: '14px', borderBottom: '2px solid var(--ul-c3)' }}>
                      💱 Order Currency
                    </h3>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      {[
                        { value: 'INR', label: '₹ Indian Rupee (INR)' },
                        { value: 'AED', label: 'د.إ UAE Dirham (AED)' },
                      ].map(({ value, label }) => (
                        <label
                          key={value}
                          onClick={() => setCurrency(value)}
                          style={{
                            flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
                            border: `2px solid ${currency === value ? 'var(--ul-primary)' : 'var(--ul-gray2)'}`,
                            background: currency === value ? 'var(--ul-c4)' : '#fff',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            fontWeight: 700, color: currency === value ? 'var(--ul-primary)' : 'var(--ul-gray)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            border: `2px solid ${currency === value ? 'var(--ul-primary)' : 'var(--ul-gray2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {currency === value && <span style={{ width: '10px', height: '10px', background: 'var(--ul-primary)', borderRadius: '50%' }} />}
                          </span>
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '28px' }}>
                    <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '20px', fontSize: '1.1rem', paddingBottom: '14px', borderBottom: '2px solid var(--ul-c3)' }}>
                      💳 Payment Method
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                        { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Transfer to our bank account' },
                      ].map(({ value, label, icon, desc }) => (
                        <label
                          key={value}
                          onClick={() => setFormData({ ...formData, payment_method: value })}
                          style={{
                            padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                            border: `2px solid ${formData.payment_method === value ? 'var(--ul-primary)' : 'var(--ul-gray2)'}`,
                            background: formData.payment_method === value ? 'var(--ul-c4)' : '#fff',
                            display: 'flex', alignItems: 'center', gap: '14px',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, color: formData.payment_method === value ? 'var(--ul-primary)' : 'var(--ul-black)', fontSize: '0.95rem' }}>{label}</div>
                            <div style={{ color: 'var(--ul-gray)', fontSize: '0.82rem' }}>{desc}</div>
                          </div>
                          <span style={{
                            marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%',
                            border: `2px solid ${formData.payment_method === value ? 'var(--ul-primary)' : 'var(--ul-gray2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {formData.payment_method === value && <span style={{ width: '10px', height: '10px', background: 'var(--ul-primary)', borderRadius: '50%' }} />}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div className="col-lg-5 col-12">
                  <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', padding: '28px', position: 'sticky', top: '90px' }}>
                    <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '20px', fontSize: '1.1rem', paddingBottom: '14px', borderBottom: '2px solid var(--ul-c3)' }}>
                      🛒 Order Summary
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {items.map(item => {
                        const price = currency === 'INR' ? item.product?.price_inr : item.product?.price_aed;
                        return (
                          <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--ul-gray3)', flexShrink: 0, overflow: 'hidden' }}>
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 600, color: 'var(--ul-black)', margin: 0, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</p>
                              <p style={{ color: 'var(--ul-gray)', margin: 0, fontSize: '0.8rem' }}>Qty: {item.quantity}</p>
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--ul-primary)', fontSize: '0.9rem', flexShrink: 0 }}>
                              {formatCurrency(price * item.quantity, currency)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ borderTop: '1px solid var(--ul-gray3)', paddingTop: '16px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
                        <span style={{ fontWeight: 800, color: 'var(--ul-black)', fontSize: '1.05rem' }}>Total</span>
                        <span style={{ fontWeight: 800, color: 'var(--ul-primary)', fontSize: '1.2rem' }}>
                          {formatCurrency(calcTotal(currency), currency)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="ul-btn"
                      style={{ width: '100%', height: '52px', fontSize: '1rem', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? 'Placing Order...' : 'Place Order →'}
                    </button>
                    <Link to="/cart" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: 'var(--ul-gray)', fontSize: '0.9rem', fontWeight: 600 }}>
                      ← Back to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Checkout;
