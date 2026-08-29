import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts';
import axios from '../api/axios.js';
import { money, shortDate, titleCase } from '../utils/format.js';

const STATUS_BADGE = {
  pending: 'badge-yellow',
  processing: 'badge-blue',
  shipped: 'badge-teal',
  delivered: 'badge-green',
  cancelled: 'badge-red',
};

const ROLE_BADGE = {
  admin: 'badge-red', manager: 'badge-blue', accountant: 'badge-blue',
  hr: 'badge-teal', distributor: 'badge-teal', agent: 'badge-yellow', customer: 'badge-green',
};

const Ic = {
  cash: <path d="M2 7h20v10H2zM12 12a2 2 0 1 0 0-.01M6 10v4M18 10v4" />,
  cart: <path d="M6 6h15l-1.5 9h-12zM6 6 5 3H2M9 20a1 1 0 1 0 .01 0M18 20a1 1 0 1 0 .01 0" />,
  box: <path d="M21 8 12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />,
  users: <path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M22 20v-2a4 4 0 0 0-3-3.9M16 1.1a4 4 0 0 1 0 7.8" />,
  store: <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M2 9l2-6h16l2 6a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />,
  alert: <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
  check: <path d="M20 6 9 17l-5-5" />,
};

const svg = (children, size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export default function Dashboard() {
  const nav = useNavigate();
  const [s, setS] = useState(null);
  const [chart, setChart] = useState([]);
  const [chartReal, setChartReal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/admin/stats').then((r) => setS(r.data)).catch(() => {}),
      axios.get('/admin/monthly-stats').then((r) => {
        if (Array.isArray(r.data) && r.data.length) {
          setChart(r.data);
          setChartReal(r.data.some((m) => m.orders || m.revenue));
        }
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: 'Gross Revenue', icon: Ic.cash,
      value: money(s?.total_revenue, 'AED'),
      sub: s ? `₹${Number(s.revenue_by_currency?.INR || 0).toLocaleString('en-IN')} · AED ${Number(s.revenue_by_currency?.AED || 0).toLocaleString('en-IN')}` : '',
    },
    {
      label: 'Orders', icon: Ic.cart, value: (s?.total_orders ?? 0).toLocaleString(),
      sub: s?.orders_by_status?.pending ? `${s.orders_by_status.pending} pending` : 'no pending orders',
      to: '/orders',
    },
    {
      label: 'Products', icon: Ic.box, value: (s?.total_products ?? 0).toLocaleString(),
      sub: s?.low_stock_products || s?.out_of_stock_products
        ? `${(s.low_stock_products || 0) + (s.out_of_stock_products || 0)} need restock`
        : 'stock healthy',
      to: '/products',
      warn: !!(s?.low_stock_products || s?.out_of_stock_products),
    },
    {
      label: 'Customers', icon: Ic.users, value: (s?.customers ?? 0).toLocaleString(),
      sub: s?.unverified_users ? `${s.unverified_users} unverified` : 'all verified',
      to: '/users',
    },
    {
      label: 'Distributors & Agents', icon: Ic.store, value: (s?.vendors ?? 0).toLocaleString(),
      sub: `${s?.staff ?? 0} staff`, to: '/users',
    },
  ];

  const actions = [
    { n: s?.pending_commissions, label: 'commissions awaiting approval', extra: s && money(s.pending_commission_value, 'AED'), to: '/commissions' },
    { n: s?.pending_withdrawals, label: 'withdrawal requests to process', extra: s && money(s.pending_withdrawal_value, 'AED'), to: '/withdrawals' },
    { n: s?.out_of_stock_products, label: 'products out of stock', to: '/products' },
    { n: s?.low_stock_products, label: 'products low on stock', to: '/products' },
    { n: s?.unverified_users, label: 'users with unverified email', to: '/users' },
  ].filter((a) => a.n > 0);

  const orders = s?.recent_orders || [];
  const signups = s?.recent_users || [];
  const obs = s?.orders_by_status || {};

  return (
    <div>
      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16,
          marginBottom: 22,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            onClick={k.to ? () => nav(k.to) : undefined}
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              boxShadow: 'var(--shadow)',
              cursor: k.to ? 'pointer' : 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: k.warn ? 'var(--warning-bg)' : 'var(--primary-bg)',
                color: k.warn ? 'var(--warning)' : 'var(--primary-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{svg(k.icon, 18)}</div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                {k.label}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15 }}>
              {loading ? '—' : k.value}
            </div>
            <div style={{ fontSize: '0.76rem', marginTop: 4, color: k.warn ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 500 }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 22, alignItems: 'start' }}>
        {/* Action required */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Needs your attention</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : actions.length === 0 ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '20px 22px', color: 'var(--success)' }}>
                <span style={{ color: 'var(--success)' }}>{svg(Ic.check, 22)}</span>
                <strong>All caught up — nothing needs action.</strong>
              </div>
            ) : (
              actions.map((a) => (
                <Link
                  to={a.to}
                  key={a.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px',
                    borderBottom: '1px solid var(--gray-100)', color: 'var(--text)',
                  }}
                >
                  <span style={{
                    minWidth: 34, height: 34, borderRadius: 9, background: 'var(--warning-bg)', color: 'var(--warning)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
                  }}>{a.n}</span>
                  <span style={{ flex: 1 }}>
                    {titleCase(a.label.split(' ')[0])} {a.label.split(' ').slice(1).join(' ')}
                    {a.extra ? <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}> · {a.extra}</span> : null}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Orders by status */}
        <div className="card">
          <div className="card-header"><div className="card-title">Orders by status</div></div>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => {
              const count = obs[st] || 0;
              const total = s?.total_orders || 1;
              return (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge ${STATUS_BADGE[st]}`} style={{ minWidth: 92, justifyContent: 'center' }}>{titleCase(st)}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--gray-100)', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / total) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 999 }} />
                  </div>
                  <strong style={{ minWidth: 28, textAlign: 'right' }}>{count}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 22 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Orders</div>
            {!chartReal && !loading && <span style={{ fontSize: '0.72rem', color: '#9ab5b3', fontStyle: 'italic' }}>No data yet</span>}
          </div>
          <div className="card-body">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f3" />
                  <XAxis dataKey="name" tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ab5b3', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2eae9' }} />
                  <Bar dataKey="orders" fill="#76b0ab" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue Trend</div>
            {!chartReal && !loading && <span style={{ fontSize: '0.72rem', color: '#9ab5b3', fontStyle: 'italic' }}>No data yet</span>}
          </div>
          <div className="card-body">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chart}>
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

      {/* Recent activity */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Orders</div>
            <Link to="/orders" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div className="table-wrap">
            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : orders.length === 0 ? (
              <div className="empty-state"><div className="icon">📦</div><h3>No orders yet</h3></div>
            ) : (
              <table>
                <thead>
                  <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong style={{ color: 'var(--primary-dark)' }}>#{o.order_number}</strong></td>
                      <td>{o.recipient_name || o.user?.full_name || '—'}</td>
                      <td><strong>{money(o.total_amount ?? o.total, o.currency)}</strong></td>
                      <td><span className={`badge ${STATUS_BADGE[o.order_status || o.status] || 'badge-gray'}`}>{titleCase(o.order_status || o.status)}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{shortDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Signups</div>
            <Link to="/users" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          <div className="table-wrap">
            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : signups.length === 0 ? (
              <div className="empty-state"><div className="icon">👥</div><h3>No users yet</h3></div>
            ) : (
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {signups.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td><span className={`badge ${ROLE_BADGE[u.role] || 'badge-gray'}`}>{u.role}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{shortDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
