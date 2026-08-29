import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { money, shortDate } from '../utils/format.js';

const STAFF_ROLES = ['admin', 'manager', 'accountant'];

const STATUS_BADGE = {
  pending: <span className="badge badge-yellow">⏳ Pending</span>,
  approved: <span className="badge badge-green">✅ Approved</span>,
  rejected: <span className="badge badge-red">❌ Rejected</span>,
};

const EMPTY_REQUEST = {
  amount: '',
  account_name: '',
  account_number: '',
  bank_name: '',
  ifsc_code: '',
};

export default function Withdrawals() {
  const { user } = useAuth();
  const isStaff = STAFF_ROLES.includes(user?.role);

  const [items, setItems] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [req, setReq] = useState(EMPTY_REQUEST);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      if (isStaff) {
        const r = await axios.get('/withdrawals');
        setItems(r.data?.data || r.data || []);
      } else {
        const [w, mine] = await Promise.all([
          axios.get('/wallet').catch(() => ({ data: {} })),
          axios.get('/my-withdrawals'),
        ]);
        setWallet(w.data?.wallet || w.data || null);
        setItems(mine.data?.data || mine.data || []);
      }
    } catch {
      toast.error('Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  const act = async (id, action) => {
    if (action === 'reject') {
      const notes = window.prompt('Reason for rejecting this withdrawal:');
      if (notes === null) return;
      if (!notes.trim()) return toast.error('A reason is required to reject');
      try {
        await axios.post(`/withdrawals/${id}/reject`, { notes });
        toast.success('Withdrawal rejected');
        fetchAll();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reject');
      }
      return;
    }
    if (!window.confirm('Approve this withdrawal? Funds will be debited from the wallet.')) return;
    try {
      await axios.post(`/withdrawals/${id}/approve`);
      toast.success('Withdrawal approved');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (Number(req.amount) < 100) return toast.error('Minimum withdrawal is 100');
    setSaving(true);
    try {
      await axios.post('/wallet/withdraw', {
        amount: Number(req.amount),
        bank_details: {
          account_name: req.account_name,
          account_number: req.account_number,
          bank_name: req.bank_name,
          ifsc_code: req.ifsc_code,
        },
      });
      toast.success('Withdrawal request submitted');
      setModal(false);
      setReq(EMPTY_REQUEST);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSaving(false);
    }
  };

  const bankLine = (w) => {
    const b = w.bank_details || {};
    return [b.bank_name, b.account_name, b.account_number].filter(Boolean).join(' · ') || '—';
  };

  const filtered = items.filter((i) => filter === 'all' || i.status === filter);
  const count = (s) => items.filter((i) => i.status === s).length;

  return (
    <div>
      <div className="page-header">
        <h1>{isStaff ? 'Withdrawal Requests' : 'My Wallet'}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={fetchAll}>🔄 Refresh</button>
          {!isStaff && (
            <button className="btn btn-primary" onClick={() => setModal(true)}>
              + Request Withdrawal
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {!isStaff && (
          <div style={{ flex: '1 1 180px', background: 'var(--primary-bg)', border: '1px solid var(--primary-light)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              {money(wallet?.balance, wallet?.currency)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--primary-dark)', fontWeight: 600 }}>Available balance</div>
          </div>
        )}
        {[
          { label: 'Pending', s: 'pending', color: 'var(--warning)', bg: 'var(--warning-bg)' },
          { label: 'Approved', s: 'approved', color: 'var(--success)', bg: 'var(--success-bg)' },
          { label: 'Rejected', s: 'rejected', color: 'var(--danger)', bg: 'var(--danger-bg)' },
        ].map((c) => (
          <div key={c.s} style={{ flex: '1 1 140px', background: c.bg, border: `1px solid ${c.color}22`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: c.color }}>{count(c.s)}</div>
            <div style={{ fontSize: '0.82rem', color: c.color, fontWeight: 600 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="icon">💳</div><h3>No withdrawal requests</h3></div>
          ) : (
            <table>
              <thead>
                <tr>
                  {isStaff && <th>User</th>}
                  <th>Amount</th>
                  <th>Bank details</th>
                  <th>Status</th>
                  <th>Date</th>
                  {isStaff && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr key={w.id}>
                    {isStaff && (
                      <td>
                        <div style={{ fontWeight: 600 }}>{w.user?.full_name || w.user?.name || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.user?.email}</div>
                      </td>
                    )}
                    <td><strong>{money(w.amount, w.currency)}</strong></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {bankLine(w)}
                    </td>
                    <td>{STATUS_BADGE[w.status] || <span className="badge badge-gray">{w.status}</span>}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{shortDate(w.created_at)}</td>
                    {isStaff && (
                      <td>
                        {w.status === 'pending' ? (
                          <div className="actions">
                            <button className="btn btn-success btn-sm" onClick={() => act(w.id, 'approve')}>✅ Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => act(w.id, 'reject')}>❌ Reject</button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Request Withdrawal</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={submitRequest}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Amount *</label>
                  <input
                    type="number"
                    min="100"
                    step="0.01"
                    className="form-control"
                    value={req.amount}
                    onChange={(e) => setReq({ ...req, amount: e.target.value })}
                    required
                    placeholder="Minimum 100"
                  />
                  <small style={{ color: 'var(--text-muted)' }}>
                    Available: {money(wallet?.balance, wallet?.currency)}
                  </small>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Account name *</label>
                    <input className="form-control" value={req.account_name} required
                      onChange={(e) => setReq({ ...req, account_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account number *</label>
                    <input className="form-control" value={req.account_number} required
                      onChange={(e) => setReq({ ...req, account_number: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bank name *</label>
                    <input className="form-control" value={req.bank_name} required
                      onChange={(e) => setReq({ ...req, bank_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">IFSC / SWIFT *</label>
                    <input className="form-control" value={req.ifsc_code} required
                      onChange={(e) => setReq({ ...req, ifsc_code: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
