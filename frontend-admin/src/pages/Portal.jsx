import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios.js';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { money, shortDate, titleCase } from '../utils/format.js';

const STAT_CARDS = [
  { key: 'my_products',      label: 'My Products',      icon: '📦', color: '#4a8c87', bg: '#dff0ee' },
  { key: 'wallet_balance',   label: 'Wallet Balance',   icon: '💰', color: '#2a6461', bg: '#c0dddb' },
  { key: 'total_earnings',   label: 'Total Earned',     icon: '✅', color: '#276749', bg: '#e6ffed' },
  { key: 'pending_earnings', label: 'Pending Approval', icon: '⏳', color: '#d69e2e', bg: '#fffff0' },
];

const STATUS_COLOR = {
  pending:  { color: '#d69e2e', bg: '#fffff0' },
  approved: { color: '#276749', bg: '#e6ffed' },
  paid:     { color: '#3182ce', bg: '#ebf8ff' },
  rejected: { color: '#c53030', bg: '#fff5f5' },
};

export default function Portal() {
  const [stats, setStats]           = useState({ my_products: 0, wallet_balance: 0, total_earnings: 0, pending_earnings: 0 });
  const [commissions, setCommissions] = useState([]);
  const [chartData, setChartData]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/portal/stats').then(r => {
        setStats(r.data);
        setChartData(r.data.monthly_earnings || []);
        setCommissions(r.data.recent_commissions || []);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const fmtCurrency = (n) => money(n, 'AED');

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-grid">
        {STAT_CARDS.map(s => (
          <div className="stat-card" key={s.key} style={{ color: s.color }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <div className="label">{s.label}</div>
              <div className="value">
                {loading ? '—' : (
                  ['wallet_balance', 'total_earnings', 'pending_earnings'].includes(s.key)
                    ? fmtCurrency(stats[s.key])
                    : (stats[s.key] || 0).toLocaleString()
                )}
              </div>
              {s.key === 'wallet_balance' && <div className="change" style={{ color: '#3b7d78' }}>Available for withdrawal</div>}
              {s.key === 'pending_earnings' && <div className="change" style={{ color: '#d69e2e' }}>Awaiting admin approval</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Earnings Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">My Earnings (Last 6 Months)</div>
        </div>
        <div className="card-body">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f3" />
                <XAxis dataKey="name" tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ab5b3', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2eae9' }}
                  formatter={(v) => [`AED ${v.toFixed(2)}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="#76b0ab" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Commissions Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Commissions</div>
          <Link to="/commissions" className="btn btn-outline btn-sm">View All →</Link>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : commissions.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💰</div>
              <h3>No commissions yet</h3>
              <p>Commissions will appear here after your first sale.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order #</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map(c => {
                  const st = STATUS_COLOR[c.status] || STATUS_COLOR.pending;
                  return (
                    <tr key={c.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                          {c.order_item?.order?.order_number || `#${c.order_item_id || c.id}`}
                        </span>
                      </td>
                      <td>{c.order_item?.product?.name || '—'}</td>
                      <td><strong style={{ color: 'var(--primary-dark)' }}>{money(c.amount, c.currency)}</strong></td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '999px', fontWeight: 700, fontSize: '0.78rem', color: st.color, background: st.bg }}>
                          {titleCase(c.status)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{shortDate(c.created_at)}</td>
                    </tr>
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
