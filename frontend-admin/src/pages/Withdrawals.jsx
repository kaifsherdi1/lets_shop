import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';

export default function Withdrawals() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => { fetchWithdrawals(); }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/withdrawals');
      setItems(r.data?.data || r.data || []);
    } catch { toast.error('Failed to load withdrawal requests'); }
    finally { setLoading(false); }
  };

  const act = async (id, action) => {
    const msg = action === 'approve' ? 'Approve this withdrawal?' : 'Reject this withdrawal?';
    if (!confirm(msg)) return;
    try {
      await axios.post(`/withdrawals/${id}/${action}`);
      toast.success(`Withdrawal ${action}d!`); fetchWithdrawals();
    } catch (err) { toast.error(err.response?.data?.message || `Failed to ${action}`); }
  };

  const STATUS_BADGE = {
    pending:  <span className="badge badge-yellow">⏳ Pending</span>,
    approved: <span className="badge badge-green">✅ Approved</span>,
    rejected: <span className="badge badge-red">❌ Rejected</span>,
  };

  const filtered = items.filter(i => filter === 'all' || i.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Withdrawal Requests</h1>
        <button className="btn btn-outline" onClick={fetchWithdrawals}>🔄 Refresh</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Pending',  count: items.filter(i => i.status === 'pending').length,  color: 'var(--warning)',  bg: 'var(--warning-bg)' },
          { label: 'Approved', count: items.filter(i => i.status === 'approved').length, color: 'var(--success)',  bg: 'var(--success-bg)' },
          { label: 'Rejected', count: items.filter(i => i.status === 'rejected').length, color: 'var(--danger)',   bg: 'var(--danger-bg)' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.82rem', color: s.color, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading-wrap"><div className="spinner" /></div> :
          filtered.length === 0 ? <div className="empty-state"><div className="icon">💳</div><h3>No withdrawal requests</h3></div> : (
            <table>
              <thead><tr><th>User</th><th>Amount</th><th>Method</th><th>Details</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(w => (
                  <tr key={w.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{w.user?.full_name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.user?.email}</div>
                    </td>
                    <td><strong>AED {Number(w.amount || 0).toFixed(2)}</strong></td>
                    <td><span className="badge badge-gray">{w.payment_method || '—'}</span></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.account_details || w.notes || '—'}
                    </td>
                    <td>{STATUS_BADGE[w.status] || <span className="badge badge-gray">{w.status}</span>}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(w.created_at).toLocaleDateString()}</td>
                    <td>
                      {w.status === 'pending' ? (
                        <div className="actions">
                          <button className="btn btn-success btn-sm" onClick={() => act(w.id, 'approve')}>✅ Approve</button>
                          <button className="btn btn-danger btn-sm"  onClick={() => act(w.id, 'reject')}>❌ Reject</button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
