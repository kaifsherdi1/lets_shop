import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price_aed: '', price_inr: '', stock_quantity: '', category_id: '' };

export default function Products() {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([axios.get('/products?per_page=100'), axios.get('/categories')]);
      setProducts(pr.data?.data || pr.data || []);
      setCategories(cr.data?.data || cr.data || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (p)  => { setEditing(p); setForm({ name: p.name, description: p.description || '', price_aed: p.price_aed, price_inr: p.price_inr, stock_quantity: p.stock_quantity, category_id: p.category_id || '' }); setModal(true); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await axios.put(`/products/${editing.id}`, form); toast.success('Product updated!'); }
      else         { await axios.post('/products', form);               toast.success('Product created!'); }
      setModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await axios.delete(`/products/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Failed to delete product'); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Products <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({filtered.length})</span></h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading-wrap"><div className="spinner" /></div> :
          filtered.length === 0 ? <div className="empty-state"><div className="icon">📦</div><h3>No products found</h3></div> : (
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>AED</th><th>INR</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.images?.[0]
                          ? <img src={p.images[0].startsWith('http') ? p.images[0] : `http://localhost:8000${p.images[0]}`}
                              className="product-thumb" alt={p.name} />
                          : <div className="product-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                        }
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          {p.sku && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-teal">{p.category?.name || '—'}</span></td>
                    <td><strong>AED {Number(p.price_aed || 0).toFixed(2)}</strong></td>
                    <td>₹ {Number(p.price_inr || 0).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.stock_quantity > 10 ? 'badge-green' : p.stock_quantity > 0 ? 'badge-yellow' : 'badge-red'}`}>
                        {p.stock_quantity} units
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Product' : 'Add New Product'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Sony WH-1000XM5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Price (AED) *</label>
                    <input type="number" step="0.01" className="form-control" value={form.price_aed} onChange={e => setForm({...form, price_aed: e.target.value})} required placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (INR) *</label>
                    <input type="number" step="0.01" className="form-control" value={form.price_inr} onChange={e => setForm({...form, price_inr: e.target.value})} required placeholder="0.00" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input type="number" className="form-control" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} required placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
