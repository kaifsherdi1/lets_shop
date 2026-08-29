import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Thumb from '../components/Thumb.jsx';
import { money, titleCase } from '../utils/format.js';

const STAFF_ROLES = ['admin', 'manager', 'accountant'];

const EMPTY = {
  name: '',
  sku: '',
  description: '',
  category_id: '',
  price_aed: '',
  price_inr: '',
  distributor_price_aed: '',
  distributor_price_inr: '',
  commission_amount_aed: '',
  commission_amount_inr: '',
  stock_quantity: '',
  status: 'active',
};

const REQUIRED_NUMERIC = [
  'price_aed',
  'price_inr',
  'distributor_price_aed',
  'distributor_price_inr',
  'commission_amount_aed',
  'commission_amount_inr',
  'stock_quantity',
];

const slugSku = (name) =>
  `${(name || 'PRD')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 12)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export default function Products() {
  const { user } = useAuth();
  const isStaff = STAFF_ROLES.includes(user?.role);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const productsUrl = isStaff ? '/products?per_page=100' : '/portal/products';
      const [pr, cr] = await Promise.all([
        axios.get(productsUrl),
        axios.get('/categories'),
      ]);
      setProducts(pr.data?.data || pr.data || []);
      setCategories(cr.data?.categories || cr.data?.data || cr.data || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setFiles([]);
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      description: p.description || '',
      category_id: p.category_id || p.category?.id || '',
      price_aed: p.price_aed ?? '',
      price_inr: p.price_inr ?? '',
      distributor_price_aed: p.distributor_price_aed ?? '',
      distributor_price_inr: p.distributor_price_inr ?? '',
      commission_amount_aed: p.commission_amount_aed ?? '',
      commission_amount_inr: p.commission_amount_inr ?? '',
      stock_quantity: p.stock_quantity ?? '',
      status: p.status || 'active',
    });
    setFiles([]);
    setModal(true);
  };

  const validate = () => {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.category_id) return 'Please choose a category';
    if (!editing && !form.sku.trim()) return 'SKU is required';
    for (const k of REQUIRED_NUMERIC) {
      if (form[k] === '' || form[k] === null || Number.isNaN(Number(form[k]))) {
        return `${titleCase(k)} must be a number`;
      }
      if (Number(form[k]) < 0) return `${titleCase(k)} cannot be negative`;
    }
    return null;
  };

  const save = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);

    try {
      const fd = new FormData();
      const payload = { ...form };
      if (editing) delete payload.sku; // SKU is immutable after creation
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      files.forEach((file) => fd.append('images[]', file));

      if (editing) {
        fd.append('_method', 'PUT');
        await axios.post(`/products/${editing.id}`, fd);
        toast.success('Product updated');
      } else {
        await axios.post('/products', fd);
        toast.success('Product created');
      }
      setModal(false);
      fetchAll();
    } catch (err) {
      const res = err.response?.data;
      const firstError = res?.errors && Object.values(res.errors)[0]?.[0];
      toast.error(firstError || res?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="page-header">
        <h1>
          Products{' '}
          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            ({filtered.length})
          </span>
        </h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="Search by name, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <h3>No products found</h3>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price (AED)</th>
                  <th>Price (INR)</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Thumb product={p} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            {p.sku && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                SKU: {p.sku}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-teal">{p.category?.name || '—'}</span>
                      </td>
                      <td>
                        <strong>{money(p.price_aed, 'AED')}</strong>
                      </td>
                      <td>{money(p.price_inr, 'INR')}</td>
                      <td>
                        <span
                          className={`badge ${
                            p.stock_quantity > 10
                              ? 'badge-green'
                              : p.stock_quantity > 0
                                ? 'badge-yellow'
                                : 'badge-red'
                          }`}
                        >
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-gray'}`}
                        >
                          {titleCase(p.status || 'active')}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                            ✏️ Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Product' : 'Add New Product'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={set('name')}
                    required
                    placeholder="e.g. Sony WH-1000XM5 Headphones"
                  />
                </div>

                {!editing && (
                  <div className="form-group">
                    <label className="form-label">SKU *</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="form-control"
                        value={form.sku}
                        onChange={set('sku')}
                        required
                        placeholder="Unique stock code"
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setForm((f) => ({ ...f, sku: slugSku(f.name) }))}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.category_id} onChange={set('category_id')} required>
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={set('description')}
                    required
                    placeholder="Product description shown to customers..."
                  />
                </div>

                <fieldset style={{ border: '1px solid var(--gray-200)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <legend style={{ padding: '0 8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Selling price
                  </legend>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Price (AED) *" value={form.price_aed} onChange={set('price_aed')} />
                    <Field label="Price (INR) *" value={form.price_inr} onChange={set('price_inr')} />
                  </div>
                </fieldset>

                <fieldset style={{ border: '1px solid var(--gray-200)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <legend style={{ padding: '0 8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Distributor cost &amp; commission (not shown to customers)
                  </legend>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Cost (AED) *" value={form.distributor_price_aed} onChange={set('distributor_price_aed')} />
                    <Field label="Cost (INR) *" value={form.distributor_price_inr} onChange={set('distributor_price_inr')} />
                    <Field label="Commission (AED) *" value={form.commission_amount_aed} onChange={set('commission_amount_aed')} />
                    <Field label="Commission (INR) *" value={form.commission_amount_inr} onChange={set('commission_amount_inr')} />
                  </div>
                </fieldset>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field
                    label="Stock Quantity *"
                    value={form.stock_quantity}
                    onChange={set('stock_quantity')}
                    step="1"
                  />
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={form.status} onChange={set('status')}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of stock</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Images {editing ? '(uploading adds to existing)' : ''}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  />
                  {files.length > 0 && (
                    <small style={{ color: 'var(--text-muted)' }}>{files.length} file(s) selected</small>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, step = '0.01' }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type="number"
        step={step}
        min="0"
        className="form-control"
        value={value}
        onChange={onChange}
        required
        placeholder="0"
      />
    </div>
  );
}
