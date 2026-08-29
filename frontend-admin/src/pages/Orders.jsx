import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';
import Thumb from '../components/Thumb.jsx';
import { money, shortDate, titleCase } from '../utils/format.js';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_BADGE = {
  pending: 'badge-yellow', processing: 'badge-blue', shipped: 'badge-teal',
  delivered: 'badge-green', cancelled: 'badge-red',
};
const PAY_BADGE = { paid: 'badge-green', pending: 'badge-yellow', failed: 'badge-red', refunded: 'badge-gray' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get('/orders', { params: { per_page: 20, page } });
      const d = r.data;
      setOrders(d.data || []);
      setMeta({ current_page: d.current_page || 1, last_page: d.last_page || 1, total: d.total || 0 });
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      await axios.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Order marked ${status}`);
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, order_status: status, status } : o)));
      setDetail((d) => (d && d.id === id ? { ...d, order_status: status, status } : d));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingId(null);
    }
  };

  const openDetail = async (o) => {
    setDetail(o);
    try {
      const r = await axios.get(`/orders/${o.id}`);
      if (r.data?.order) setDetail(r.data.order);
    } catch { /* keep list row data */ }
  };

  const q = search.toLowerCase();
  const filtered = orders.filter((o) => {
    const st = o.order_status || o.status || '';
    return (filter === 'all' || st === filter)
      && (!q || o.order_number?.toLowerCase().includes(q) || (o.recipient_name || '').toLowerCase().includes(q) || (o.user?.full_name || '').toLowerCase().includes(q));
  });

  const counts = orders.reduce((acc, o) => {
    const st = o.order_status || o.status || 'pending';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h1>Orders <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({meta.total})</span></h1>
        <button className="btn btn-outline" onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="search-input" placeholder="Search order # or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
              {s === 'all' ? 'All' : titleCase(s)}{s !== 'all' && counts[s] ? ` (${counts[s]})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">🛒</div><h3>No orders found</h3></div>
          ) : (
            <table>
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th><th>Date</th></tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const st = o.order_status || o.status || 'pending';
                  return (
                    <tr key={o.id}>
                      <td>
                        <button onClick={() => openDetail(o)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 700, color: 'var(--primary-dark)' }}>
                          #{o.order_number}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.recipient_name || o.user?.full_name || '—'}</div>
                        {(o.recipient_phone || o.user?.email) && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.recipient_phone || o.user?.email}</div>}
                      </td>
                      <td>{o.items?.length ?? '—'}</td>
                      <td><strong>{money(o.total_amount ?? o.total, o.currency)}</strong></td>
                      <td>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>{titleCase(o.payment_method)}</div>
                        <span className={`badge ${PAY_BADGE[o.payment_status] || 'badge-gray'}`} style={{ fontSize: '0.68rem' }}>{o.payment_status || 'pending'}</span>
                      </td>
                      <td><span className={`badge ${STATUS_BADGE[st] || 'badge-gray'}`}>{titleCase(st)}</span></td>
                      <td>
                        <select
                          className="form-control" style={{ width: 130, padding: '5px 8px', fontSize: '0.8rem' }}
                          value={st} disabled={savingId === o.id}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                        </select>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{shortDate(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {meta.last_page > 1 && (
          <div className="pagination">
            <button className="pag-btn" disabled={meta.current_page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span className="pag-info">Page {meta.current_page} of {meta.last_page}</span>
            <button className="pag-btn" disabled={meta.current_page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {detail && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div className="modal-title">Order #{detail.order_number}</div>
              <button className="modal-close" onClick={() => setDetail(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className={`badge ${STATUS_BADGE[detail.order_status || detail.status] || 'badge-gray'}`}>{titleCase(detail.order_status || detail.status)}</span>
                <span className={`badge ${PAY_BADGE[detail.payment_status] || 'badge-gray'}`}>Payment: {detail.payment_status || 'pending'}</span>
                <span className="badge badge-gray">{titleCase(detail.payment_method)}</span>
                <span className="badge badge-gray">{detail.currency}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <Info label="Customer" value={detail.recipient_name || detail.user?.full_name || '—'} />
                <Info label="Phone" value={detail.recipient_phone || '—'} />
                <Info label="Email" value={detail.user?.email || '—'} />
                <Info label="Placed" value={shortDate(detail.created_at)} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <Info label="Delivery address" value={detail.delivery_address || '—'} />
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>Items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {(detail.items || []).map((it) => (
                  <div key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 10 }}>
                    <Thumb product={it.product} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{it.product?.name || 'Product'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{money(it.price, detail.currency)} × {it.quantity}</div>
                    </div>
                    <strong>{money(Number(it.price) * it.quantity, detail.currency)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 12, display: 'grid', gap: 6 }}>
                <Row label="Subtotal" value={money(detail.subtotal, detail.currency)} />
                <Row label="Tax" value={money(detail.tax, detail.currency)} />
                <Row label="Shipping" value={money(detail.shipping_fee, detail.currency)} />
                <Row label="Total" value={money(detail.total_amount ?? detail.total, detail.currency)} bold />
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <select
                className="form-control" style={{ width: 160 }}
                value={detail.order_status || detail.status}
                onChange={(e) => updateStatus(detail.id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>Mark {titleCase(s)}</option>)}
              </select>
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: '0.9rem' }}>{value}</div>
  </div>
);
const Row = ({ label, value, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: bold ? 800 : 500, fontSize: bold ? '1rem' : '0.9rem', color: bold ? 'var(--text)' : 'var(--text-muted)' }}>
    <span>{label}</span><span>{value}</span>
  </div>
);
