import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  admin:       'badge-red',
  manager:     'badge-blue',
  accountant:  'badge-blue',
  hr:          'badge-teal',
  distributor: 'badge-teal',
  agent:       'badge-yellow',
  customer:    'badge-green',
};

const STATUS_CONFIG = {
  active:    { label: '✅ Active',    color: '#276749', bg: '#e6ffed' },
  inactive:  { label: '⏸ Inactive',  color: '#d69e2e', bg: '#fffff0' },
  suspended: { label: '🚫 Suspended', color: '#c53030', bg: '#fff5f5' },
};

export default function Users() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [toggling, setToggling] = useState({});

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/admin/users');
      setUsers(r.data?.data || r.data || []);
    } catch {
      toast.error('Failed to load users');
      setUsers([]);
    } finally { setLoading(false); }
  };

  const toggleStatus = async (userId, newStatus) => {
    setToggling(prev => ({ ...prev, [userId]: true }));
    try {
      await axios.patch(`/admin/users/${userId}/status`, { status: newStatus });
      // Optimistic UI update — no full re-fetch needed
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus === 'active' ? 'activated' : newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setToggling(prev => ({ ...prev, [userId]: false }));
    }
  };

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || u.full_name?.toLowerCase().includes(q)
      || u.name?.toLowerCase().includes(q)
      || u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const roles = ['all', ...new Set(users.map(u => u.role).filter(Boolean))];

  return (
    <div>
      <div className="page-header">
        <h1>Users <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({filtered.length})</span></h1>
        <button className="btn btn-outline" onClick={fetchUsers}>🔄 Refresh</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="search-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {roles.map(r => (
            <button key={r} onClick={() => setFilter(r)} className={`btn btn-sm ${filter === r ? 'btn-primary' : 'btn-outline'}`}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading
            ? <div className="loading-wrap"><div className="spinner" /></div>
            : filtered.length === 0
              ? (
                <div className="empty-state">
                  <div className="icon">👥</div>
                  <h3>No users found</h3>
                  <p>No users match your current filter or search.</p>
                </div>
              )
              : (
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Email Verified</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => {
                      const st = STATUS_CONFIG[u.status] || STATUS_CONFIG.active;
                      const isBusy = toggling[u.id];
                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-bg)', border: '1.5px solid var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.85rem', flexShrink: 0 }}>
                                {(u.full_name || u.name || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{u.full_name || u.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.87rem' }}>{u.email}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                          <td><span className={`badge ${ROLE_BADGE[u.role] || 'badge-gray'}`}>{u.role}</span></td>
                          <td>
                            <span style={{ padding: '4px 10px', borderRadius: '999px', fontWeight: 700, fontSize: '0.78rem', color: st.color, background: st.bg }}>
                              {st.label}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.email_verified_at ? 'badge-green' : 'badge-yellow'}`}>
                              {u.email_verified_at ? '✅ Verified' : '⏳ Pending'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {u.status === 'active' ? (
                                <button
                                  className="btn btn-sm btn-outline"
                                  style={{ fontSize: '0.75rem', color: '#d69e2e', borderColor: '#d69e2e' }}
                                  disabled={isBusy}
                                  onClick={() => toggleStatus(u.id, 'inactive')}
                                >
                                  {isBusy ? '…' : '⏸ Deactivate'}
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-primary"
                                  style={{ fontSize: '0.75rem' }}
                                  disabled={isBusy}
                                  onClick={() => toggleStatus(u.id, 'active')}
                                >
                                  {isBusy ? '…' : '✅ Activate'}
                                </button>
                              )}
                              {u.status !== 'suspended' && (
                                <button
                                  className="btn btn-sm btn-outline"
                                  style={{ fontSize: '0.75rem', color: '#c53030', borderColor: '#c53030' }}
                                  title="Suspend user"
                                  disabled={isBusy}
                                  onClick={() => {
                                    if (window.confirm(`Suspend ${u.full_name || u.email}? They won't be able to log in.`)) {
                                      toggleStatus(u.id, 'suspended');
                                    }
                                  }}
                                >
                                  🚫
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
          }
        </div>
      </div>
    </div>
  );
}
