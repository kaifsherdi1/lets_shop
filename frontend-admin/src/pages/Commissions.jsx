import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';

export default function Commissions() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState([]);
  const [filter, setFilter]           = useState('all');

  useEffect(() => { fetchCommissions(); }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/commissions');
      setCommissions(r.data?.data || r.data || []);
    } catch { toast.error('Failed to load commissions'); }
    finally { setLoading(false); }
  };

  const approve = async (id) => {
    try {
      await axios.post(`/commissions/${id}/approve`);
      toast.success('Commission approved!'); fetchCommissions();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to approve'); }
  };

  const bulkApprove = async () => {
    if (!selected.length) return;
    if (!confirm(`Approve ${selected.length} commissions?`)) return;
    try {
      await axios.post('/commissions/bulk-approve', { ids: selected });
      toast.success(`${selected.length} commissions approved!`);
      setSelected([]); fetchCommissions();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to bulk approve'); }
  };

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => {
    const pendingIds = filtered.filter(c => c.commission_status === 'pending').map(c => c.id);
    setSelected(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const filtered = commissions.filter(c => filter === 'all' || c.commission_status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Commissions</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {selected.length > 0 && (
            <button className="btn btn-success" onClick={bulkApprove}>
              ✅ Approve Selected ({selected.length})
            </button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'pending', 'approved'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading-wrap"><div className="spinner" /></div> :
          filtered.length === 0 ? <div className="empty-state"><div className="icon">💸</div><h3>No commissions</h3></div> : (
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={toggleAll}
                      checked={selected.length === filtered.filter(c => c.commission_status === 'pending').length && selected.length > 0} />
                  </th>
                  <th>Order #</th><th>Distributor/Agent</th><th>Product</th><th>Amount</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      {c.commission_status === 'pending' &&
                        <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                      }
                    </td>
                    <td><strong style={{ color: 'var(--primary-dark)' }}>#{c.order?.order_number || c.order_id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.user?.full_name || c.distributor?.full_name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.user?.role || '—'}</div>
                    </td>
                    <td>{c.product?.name || c.order_item?.product?.name || '—'}</td>
                    <td><strong>AED {Number(c.commission_amount || c.amount || 0).toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge ${c.commission_status === 'approved' ? 'badge-green' : 'badge-yellow'}`}>
                        {c.commission_status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      {c.commission_status === 'pending' ? (
                        <button className="btn btn-success btn-sm" onClick={() => approve(c.id)}>✅ Approve</button>
                      ) : (
                        <span style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: 600 }}>Approved ✓</span>
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
