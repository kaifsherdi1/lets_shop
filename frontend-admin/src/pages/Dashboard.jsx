import React, { useEffect, useState } from 'react';
import axios from '../api/axios.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const STATS = [
  { key: 'total_users',    label: 'Total Users',    icon: '👥', color: '#76b0ab', bg: '#edf5f4' },
  { key: 'total_products', label: 'Products',       icon: '📦', color: '#4a8c87', bg: '#dff0ee' },
  { key: 'total_orders',   label: 'Total Orders',   icon: '🛒', color: '#3b7d78', bg: '#d0e8e6' },
  { key: 'total_revenue',  label: 'Revenue (AED)',  icon: '💰', color: '#2a6461', bg: '#c0dddb' },
];

const MOCK_CHART = [
  { name: 'Jan', orders: 12, revenue: 4800 },
  { name: 'Feb', orders: 19, revenue: 7600 },
  { name: 'Mar', orders: 24, revenue: 9600 },
  { name: 'Apr', orders: 18, revenue: 7200 },
  { name: 'May', orders: 32, revenue: 12800 },
  { name: 'Jun', orders: 28, revenue: 11200 },
];

export default function Dashboard() {
  const [stats, setStats]     = useState({ total_users: 0, total_products: 0, total_orders: 0, total_revenue: 0 });
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}),
      axios.get('/orders').then(r => {
        const raw = r.data?.data?.data || r.data?.data || r.data || [];
        setOrders(Array.isArray(raw) ? raw.slice(0, 6) : []);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const STATUS_BADGE = {
    pending:    <span className="badge badge-yellow">⏳ Pending</span>,
    processing: <span className="badge badge-blue">🔄 Processing</span>,
    shipped:    <span className="badge badge-teal">🚚 Shipped</span>,
    delivered:  <span className="badge badge-green">✅ Delivered</span>,
    cancelled:  <span className="badge badge-red">❌ Cancelled</span>,
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-grid">
        {STATS.map(s => (
          <div className="stat-card" key={s.key} style={{ color: s.color }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-info">
              <div className="label">{s.label}</div>
              <div className="value">
                {loading ? '—' :
                  s.key === 'total_revenue'
                    ? `AED ${Number(stats[s.key] || 0).toLocaleString()}`
                    : (stats[s.key] || 0).toLocaleString()
                }
              </div>
              <div className="change">↑ +12% this month</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Orders</div>
          </div>
          <div className="card-body">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MOCK_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f3" />
                  <XAxis dataKey="name" tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2eae9' }} />
                  <Bar dataKey="orders" fill="#76b0ab" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue Trend (AED)</div>
          </div>
          <div className="card-body">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MOCK_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f3" />
                  <XAxis dataKey="name" tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2eae9' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#76b0ab" strokeWidth={2.5} dot={{ fill: '#76b0ab', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Orders</div>
          <a href="/orders" className="btn btn-outline btn-sm">View All →</a>
        </div>
        <div className="table-wrap">
          {loading ? <div className="loading-wrap"><div className="spinner" /></div> :
            orders.length === 0 ? (
              <div className="empty-state"><div className="icon">📦</div><h3>No orders yet</h3></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order #</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>#{o.order_number}</span></td>
                      <td>{o.recipient_name || o.user?.full_name || '—'}</td>
                      <td><strong>AED {Number(o.total_amount || o.total || 0).toFixed(2)}</strong></td>
                      <td><span style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 600 }}>{o.payment_method}</span></td>
                      <td>{STATUS_BADGE[o.order_status || o.status] || <span className="badge badge-gray">{o.order_status}</span>}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
}
