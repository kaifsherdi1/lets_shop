import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', slug: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/categories');
      setCategories(r.data?.data || r.data || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '', slug: c.slug || '' }); setModal(true); };

  const handleName = (val) => {
    const slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm(prev => ({ ...prev, name: val, slug: editing ? prev.slug : slug }));
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await axios.put(`/categories/${editing.id}`, form); toast.success('Category updated!'); }
      else         { await axios.post('/categories', form);               toast.success('Category created!'); }
      setModal(false); fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete category? Products in this category may be affected.')) return;
    try { await axios.delete(`/categories/${id}`); toast.success('Deleted'); fetchCategories(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const ICONS = { electronics: '⚡', fashion: '👗', 'home-kitchen': '🏠', 'sports-outdoors': '⚽' };

  return (
    <div>
      <div className="page-header">
        <h1>Categories</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Category</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading-wrap"><div className="spinner" /></div> :
          categories.length === 0 ? <div className="empty-state"><div className="icon">🗂️</div><h3>No categories</h3></div> : (
            <table>
              <thead><tr><th>Category</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                          {ICONS[c.slug] || '📁'}
                        </div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                      </div>
                    </td>
                    <td><code style={{ background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>{c.slug}</code></td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.description || '—'}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>🗑️</button>
                      </div>
                    </td>
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
              <div className="modal-title">{editing ? 'Edit Category' : 'New Category'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input className="form-control" value={form.name} onChange={e => handleName(e.target.value)} required placeholder="e.g. Electronics" />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug *</label>
                  <input className="form-control" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required placeholder="e.g. electronics" />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Auto-generated from name. Used in URLs.</small>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
