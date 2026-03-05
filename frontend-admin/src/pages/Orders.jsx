import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_BADGE = {
  pending:    'badge-yellow',
  processing: 'badge-blue',
  shipped:    'badge-teal',
  delivered:  'badge-green',
  cancelled:  'badge-red',
};
const STATUS_ICON = { pending: '⏳', processing: '🔄', shipped: '🚚', delivered: '✅', cancelled: '❌' };

export default function Orders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/orders?per_page=100');
      const raw = r.data?.data?.data || r.data?.data || r.data || [];
      setOrders(Array.isArray(raw) ? raw : []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Order updated to ${status}`);
      fetchOrders();
    } catch (err) {
      // Fallback: try the cancel endpoint if backend doesn't have admin status update yet
      if (status === 'cancelled') {
        try { await axios.post(`/orders/${id}/cancel`); toast.success('Order cancelled'); fetchOrders(); return; }
        catch {}
      }
      toast.error(err.response?.data?.message || 'Status update not available. Add /api/admin/orders/{id}/status route.');
    }
  };

  const filtered = orders.filter(o => {
    const st = o.order_status || o.status || '';
    const matchFilter = filter === 'all' || st === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.order_number?.includes(q) || o.recipient_name?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <div className="page-header">
        <h1>Orders <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({filtered.length})</span></h1>
        <button className="btn btn-outline" onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="search-input" placeholder="Search by order # or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading-wrap"><div className="spinner" /></div> :
          filtered.length === 0 ? <div className="empty-state"><div className="icon">🛒</div><h3>No orders found</h3></div> : (
            <table>
              <thead><tr><th></th><th>Order #</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Update Status</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.map(o => {
                  const st = o.order_status || o.status || 'pending';
                  return (
                    <React.Fragment key={o.id}>
                      <tr>
                        <td>
                          <button onClick={() => toggle(o.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {expanded[o.id] ? '▲' : '▼'}
                          </button>
                        </td>
                        <td><strong style={{ color: 'var(--primary-dark)' }}>#{o.order_number}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{o.recipient_name || o.user?.full_name || '—'}</div>
                          {o.recipient_phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.recipient_phone}</div>}
                        </td>
                        <td><strong>AED {Number(o.total_amount || o.total || 0).toFixed(2)}</strong></td>
                        <td><span style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 600 }}>{o.payment_method}</span></td>
                        <td>
                          <span className={`badge ${STATUS_BADGE[st] || 'badge-gray'}`}>
                            {STATUS_ICON[st]} {st}</span>
                        </td>
                        <td>
                          <select
                            className="form-control" style={{ width: 140, padding: '6px 10px', fontSize: '0.8rem' }}
                            value={st}
                            onChange={e => updateStatus(o.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                      {expanded[o.id] && (
                        <tr>
                          <td colSpan={8} style={{ background: 'var(--primary-bg)', padding: '14px 20px' }}>
                            <strong>📍 Delivery:</strong> {o.delivery_address || '—'}<br />
                            {o.items?.map(item => (
                              <span key={item.id} style={{ marginRight: 16, fontSize: '0.85rem' }}>
                                📦 {item.product?.name} × {item.quantity} — AED {Number(item.price).toFixed(2)}
                              </span>
                            ))}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
