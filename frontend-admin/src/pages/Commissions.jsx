import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { money, shortDate, titleCase } from '../utils/format.js';

const STATUS_BADGE = {
  pending: 'badge-yellow',
  approved: 'badge-blue',
  paid: 'badge-green',
  rejected: 'badge-red',
};

const APPROVER_ROLES = ['admin', 'manager', 'accountant'];

export default function Commissions() {
  const { user } = useAuth();
  const canApprove = APPROVER_ROLES.includes(user?.role);

  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const endpoint = canApprove ? '/commissions' : '/portal/commissions';
      const r = await axios.get(endpoint, { params: { per_page: 100 } });
      const payload = r.data?.commissions || r.data;
      const list = payload?.data || payload;
      setCommissions(Array.isArray(list) ? list : []);
      setSelected([]);
    } catch {
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    setBusy(true);
    try {
      await axios.post(`/commissions/${id}/approve`);
      toast.success('Commission approved — wallet credit is processing');
      setCommissions((list) =>
        list.map((c) => (c.id === id ? { ...c, status: 'approved' } : c)),
      );
      setTimeout(fetchCommissions, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setBusy(false);
    }
  };

  const bulkApprove = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Approve ${selected.length} commission(s)?`)) return;
    setBusy(true);
    try {
      const r = await axios.post('/commissions/bulk-approve', { commission_ids: selected });
      toast.success(r.data?.message || `${selected.length} commissions approved`);
      setSelected([]);
      setTimeout(fetchCommissions, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to bulk approve');
    } finally {
      setBusy(false);
    }
  };

  const filtered = commissions.filter((c) => filter === 'all' || c.status === filter);
  const pendingIds = filtered.filter((c) => c.status === 'pending').map((c) => c.id);
  const allPendingSelected = pendingIds.length > 0 && pendingIds.every((id) => selected.includes(id));

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () => setSelected(allPendingSelected ? [] : pendingIds);

  const orderNumber = (c) =>
    c.order_item?.order?.order_number || c.order?.order_number || `#${c.order_item_id || c.id}`;
  const productName = (c) => c.order_item?.product?.name || c.product?.name || '—';
  const earnerName = (c) => c.distributor?.full_name || c.distributor?.name || c.user?.full_name || '—';

  return (
    <div>
      <div className="page-header">
        <h1>
          Commissions{' '}
          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            ({filtered.length})
          </span>
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={fetchCommissions}>
            🔄 Refresh
          </button>
          {canApprove && selected.length > 0 && (
            <button className="btn btn-success" onClick={bulkApprove} disabled={busy}>
              ✅ Approve Selected ({selected.length})
            </button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'pending', 'approved', 'paid'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
          >
            {titleCase(f)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💸</div>
              <h3>No commissions</h3>
              <p>Commissions are created automatically when an order containing a distributor product is placed.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  {canApprove && (
                    <th style={{ width: 36 }}>
                      <input
                        type="checkbox"
                        checked={allPendingSelected}
                        onChange={toggleAll}
                        disabled={pendingIds.length === 0}
                      />
                    </th>
                  )}
                  <th>Order</th>
                  <th>Distributor / Agent</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  {canApprove && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    {canApprove && (
                      <td>
                        {c.status === 'pending' && (
                          <input
                            type="checkbox"
                            checked={selected.includes(c.id)}
                            onChange={() => toggle(c.id)}
                          />
                        )}
                      </td>
                    )}
                    <td>
                      <strong style={{ color: 'var(--primary-dark)' }}>{orderNumber(c)}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{earnerName(c)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {c.distributor?.role || c.distributor?.email || ''}
                      </div>
                    </td>
                    <td>{productName(c)}</td>
                    <td>
                      <strong>{money(c.amount, c.currency)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[c.status] || 'badge-gray'}`}>
                        {titleCase(c.status)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {shortDate(c.created_at)}
                    </td>
                    {canApprove && (
                      <td>
                        {c.status === 'pending' ? (
                          <button
                            className="btn btn-success btn-sm"
                            disabled={busy}
                            onClick={() => approve(c.id)}
                          >
                            ✅ Approve
                          </button>
                        ) : (
                          <span style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: 600 }}>
                            {c.status === 'paid' ? 'Paid ✓' : 'Approved ✓'}
                          </span>
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
    </div>
  );
}
