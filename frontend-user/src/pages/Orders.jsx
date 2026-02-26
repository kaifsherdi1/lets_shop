import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { orderAPI } from '../api/orders';
import { formatCurrency } from '../utils/currency';
import MainLayout from '../components/layout/MainLayout';
import PageBanner from '../components/layout/PageBanner';
import toast from 'react-hot-toast';

const statusConfig = {
  pending:    { color: '#d69e2e', bg: '#fffff0', label: 'Pending',    icon: '⏳' },
  processing: { color: '#3182ce', bg: '#ebf8ff', label: 'Processing', icon: '🔄' },
  shipped:    { color: '#6b46c1', bg: '#faf5ff', label: 'Shipped',    icon: '🚚' },
  delivered:  { color: '#276749', bg: '#e6ffed', label: 'Delivered',  icon: '✅' },
  cancelled:  { color: '#c53030', bg: '#fff5f5', label: 'Cancelled',  icon: '❌' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const { currency } = useOutletContext() || { currency: 'AED' };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getOrders();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  return (
    <MainLayout>
      <PageBanner
        title="My Orders"
        crumbs={[{ label: 'Orders' }]}
      />

      <section className="ul-section-spacing">
        <div className="ul-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ul-gray)' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto 16px', border: '4px solid var(--ul-c3)', borderTopColor: 'var(--ul-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '24px' }}>📦</span>
              <h2 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '12px' }}>No Orders Yet</h2>
              <p style={{ color: 'var(--ul-gray)', marginBottom: '28px' }}>You haven't placed any orders yet. Start shopping!</p>
              <Link to="/products" className="ul-btn">Browse Products</Link>
            </div>
          ) : (
            <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => {
                const st = statusConfig[order.status] || statusConfig.pending;
                const isExpanded = expandedOrders[order.id];
                return (
                  <div key={order.id} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: isExpanded ? '1px solid var(--ul-gray3)' : 'none' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', margin: '0 0 4px', fontSize: '1rem' }}>
                          Order #{order.order_number}
                        </h3>
                        <p style={{ color: 'var(--ul-gray)', margin: 0, fontSize: '0.82rem' }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '6px 14px', borderRadius: '999px', fontWeight: 700, fontSize: '0.82rem',
                          color: st.color, background: st.bg,
                        }}>
                          {st.icon} {st.label}
                        </span>
                        <button
                          onClick={() => toggleExpand(order.id)}
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--ul-gray2)',
                            background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '0.9rem', color: 'var(--ul-gray)',
                            transition: 'all 0.3s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {/* Summary row */}
                    <div style={{ padding: '14px 24px', display: 'flex', gap: '24px', flexWrap: 'wrap', background: 'var(--ul-c4)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--ul-gray)' }}>
                        <strong style={{ color: 'var(--ul-black)' }}>Total: </strong>
                        {formatCurrency(order.total_amount, order.currency)}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--ul-gray)' }}>
                        <strong style={{ color: 'var(--ul-black)' }}>Payment: </strong>
                        {order.payment_method?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--ul-gray)' }}>
                        <strong style={{ color: 'var(--ul-black)' }}>Status: </strong>
                        {order.payment_status}
                      </span>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            marginLeft: 'auto', padding: '4px 14px', borderRadius: '999px',
                            border: '1.5px solid #e53e3e', background: 'none',
                            color: '#e53e3e', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* Expanded items */}
                    {isExpanded && order.items && (
                      <div style={{ padding: '20px 24px' }}>
                        <h4 style={{ fontWeight: 700, color: 'var(--ul-black)', marginBottom: '14px', fontSize: '0.9rem' }}>Order Items</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: 'var(--ul-gray3)' }}>
                              <span style={{ fontWeight: 600, color: 'var(--ul-black)', fontSize: '0.9rem' }}>{item.product?.name || 'Product'}</span>
                              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--ul-gray)', fontSize: '0.85rem' }}>Qty: {item.quantity}</span>
                                <span style={{ fontWeight: 700, color: 'var(--ul-primary)', fontSize: '0.9rem' }}>{formatCurrency(item.price, order.currency)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.delivery_address && (
                          <div style={{ marginTop: '16px', padding: '12px 14px', borderRadius: '10px', background: 'var(--ul-c4)', fontSize: '0.85rem', color: 'var(--ul-gray)' }}>
                            <strong style={{ color: 'var(--ul-black)' }}>📍 Delivery: </strong>
                            {order.delivery_address}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Orders;
