import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { money, shortDate, titleCase } from '../utils/format.js';

const ROLE_BADGE = {
  admin: 'badge-red', manager: 'badge-blue', accountant: 'badge-blue',
  hr: 'badge-teal', distributor: 'badge-teal', agent: 'badge-yellow', customer: 'badge-green',
};
const STATUS = {
  active: { label: '✅ Active', color: '#276749', bg: '#e6ffed' },
  inactive: { label: '⏸ Inactive', color: '#d69e2e', bg: '#fffff0' },
  suspended: { label: '🚫 Suspended', color: '#c53030', bg: '#fff5f5' },
};
const EMPTY_NEW = { full_name: '', email: '', phone: '', password: '', password_confirmation: '', role: 'customer' };

export default function Users() {
  const { user: me } = useAuth();
  const isAdmin = me?.role === 'admin';

  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState({ search: '', role: '', status: '', unverified: false, page: 1 });
  const [busy, setBusy] = useState({});
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_NEW);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, per_page: 25 };
      if (filters.search) params.search = filters.search;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      if (filters.unverified) params.unverified = 1;
      const r = await axios.get('/admin/users', { params });
      const data = r.data;
      setUsers(data.data || []);
      setMeta({ current_page: data.current_page || 1, last_page: data.last_page || 1, total: data.total || 0 });
    } catch {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, filters.search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  useEffect(() => {
    axios.get('/admin/roles').then((r) => setRoles(r.data || [])).catch(() => {});
  }, []);

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

  const patchUser = (id, updated) =>
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...updated } : u)));

  const setStatus = async (id, status) => {
    if (status === 'suspended' && !window.confirm('Suspend this user? Active sessions will be revoked.')) return;
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const r = await axios.patch(`/admin/users/${id}/status`, { status });
      patchUser(id, { status });
      toast.success(r.data?.message || 'Updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const setRole = async (id, role) => {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const r = await axios.patch(`/admin/users/${id}/role`, { role });
      patchUser(id, { role });
      toast.success(r.data?.message || 'Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change role');
      fetchUsers();
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await axios.post('/admin/users', form);
      toast.success('User created');
      setCreateOpen(false);
      setForm(EMPTY_NEW);
      setF({ page: 1 });
      fetchUsers();
    } catch (err) {
      const res = err.response?.data;
      toast.error((res?.errors && Object.values(res.errors)[0]?.[0]) || res?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (id) => {
    setDetail({ id });
    setDetailLoading(true);
    try {
      const r = await axios.get(`/admin/users/${id}`);
      setDetail(r.data);
    } catch {
      toast.error('Failed to load user');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Users <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({meta.total})</span></h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={fetchUsers}>🔄 Refresh</button>
          {isAdmin && <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>+ Add User</button>}
        </div>
      </div>

      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="search-input" placeholder="Search name or email..." value={filters.search}
            onChange={(e) => setF({ search: e.target.value })} />
        </div>
        <select className="form-control" style={{ width: 150 }} value={filters.role} onChange={(e) => setF({ role: e.target.value })}>
          <option value="">All roles</option>
          {roles.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
        </select>
        <select className="form-control" style={{ width: 140 }} value={filters.status} onChange={(e) => setF({ status: e.target.value })}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.unverified} onChange={(e) => setF({ unverified: e.target.checked })} />
          Unverified only
        </label>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : users.length === 0 ? (
            <div className="empty-state"><div className="icon">👥</div><h3>No users match</h3></div>
          ) : (
            <table>
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Verified</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const st = STATUS[u.status] || STATUS.active;
                  const isMe = u.id === me?.id;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-bg)', border: '1.5px solid var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.8rem', flexShrink: 0 }}>
                            {(u.full_name || u.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <button onClick={() => openDetail(u.id)} style={{ fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--primary-dark)' }}>
                              {u.full_name || u.name}
                            </button>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID #{u.id}{isMe ? ' · you' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                      <td>
                        {isAdmin && !isMe ? (
                          <select
                            value={u.role}
                            disabled={busy[u.id]}
                            onChange={(e) => setRole(u.id, e.target.value)}
                            className="form-control"
                            style={{ width: 130, padding: '5px 8px', fontSize: '0.8rem' }}
                          >
                            {roles.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                          </select>
                        ) : (
                          <span className={`badge ${ROLE_BADGE[u.role] || 'badge-gray'}`}>{u.role}</span>
                        )}
                      </td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: 999, fontWeight: 700, fontSize: '0.78rem', color: st.color, background: st.bg }}>{st.label}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.email_verified_at ? 'badge-green' : 'badge-yellow'}`}>
                          {u.email_verified_at ? '✅ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{shortDate(u.created_at)}</td>
                      <td>
                        {isMe ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            {u.status === 'active' ? (
                              <button className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', color: '#d69e2e', borderColor: '#d69e2e' }} disabled={busy[u.id]} onClick={() => setStatus(u.id, 'inactive')}>
                                ⏸ Deactivate
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem' }} disabled={busy[u.id]} onClick={() => setStatus(u.id, 'active')}>
                                ✅ Activate
                              </button>
                            )}
                            {u.status !== 'suspended' && (
                              <button className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', color: '#c53030', borderColor: '#c53030' }} disabled={busy[u.id]} title="Suspend" onClick={() => setStatus(u.id, 'suspended')}>
                                🚫
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {meta.last_page > 1 && (
          <div className="pagination">
            <button className="pag-btn" disabled={meta.current_page <= 1} onClick={() => setF({ page: meta.current_page - 1 })}>← Prev</button>
            <span className="pag-info">Page {meta.current_page} of {meta.last_page}</span>
            <button className="pag-btn" disabled={meta.current_page >= meta.last_page} onClick={() => setF({ page: meta.current_page + 1 })}>Next →</button>
          </div>
        )}
      </div>

      {/* Create user modal */}
      {createOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setCreateOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Add User</div>
              <button className="modal-close" onClick={() => setCreateOpen(false)}>×</button>
            </div>
            <form onSubmit={createUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={form.full_name} required onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    {roles.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input type="password" className="form-control" value={form.password} required minLength={8} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm *</label>
                    <input type="password" className="form-control" value={form.password_confirmation} required onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>The account is created active and email-verified.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User detail drawer */}
      {detail && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <div className="modal-title">User Detail</div>
              <button className="modal-close" onClick={() => setDetail(null)}>×</button>
            </div>
            <div className="modal-body">
              {detailLoading || !detail.user ? (
                <div className="loading-wrap"><div className="spinner" /></div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.2rem' }}>
                      {(detail.user.full_name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{detail.user.full_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{detail.user.email} · {detail.user.phone || 'no phone'}</div>
                      <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                        <span className={`badge ${ROLE_BADGE[detail.user.role] || 'badge-gray'}`}>{detail.user.role}</span>
                        <span className="badge badge-gray">{titleCase(detail.user.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 18 }}>
                    <Stat label="Orders" value={detail.orders_total} />
                    {['distributor', 'agent'].includes(detail.user.role) && <>
                      <Stat label="Products" value={detail.products_count} />
                      <Stat label="Wallet" value={money(detail.wallet?.balance, detail.wallet?.currency)} />
                      <Stat label="Commission (pending)" value={money(detail.commission_summary?.pending, 'AED')} />
                      <Stat label="Commission (paid)" value={money(detail.commission_summary?.paid, 'AED')} />
                    </>}
                  </div>

                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.9rem' }}>Recent orders</div>
                  {detail.orders?.length ? (
                    <div className="table-wrap" style={{ maxHeight: 220, overflow: 'auto' }}>
                      <table>
                        <thead><tr><th>Order #</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                          {detail.orders.map((o) => (
                            <tr key={o.id}>
                              <td><strong>#{o.order_number}</strong></td>
                              <td>{money(o.total_amount ?? o.total, o.currency)}</td>
                              <td><span className="badge badge-gray">{titleCase(o.order_status || o.status)}</span></td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{shortDate(o.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
}
