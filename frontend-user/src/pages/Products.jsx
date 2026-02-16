import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getStoredCurrency } from '../utils/currency';
import Header from '../components/layout/Header';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(getStoredCurrency());
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
  });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;

      const data = await productAPI.getProducts(params);
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div>
      <Header currency={currency} setCurrency={setCurrency} />

      <div className="container">
        <h1 className="page-title">All Products</h1>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />

          <select
            value={filters.category_id}
            onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">
                    {formatCurrency(
                      currency === 'INR' ? product.price_inr : product.price_aed,
                      currency
                    )}
                  </p>
                  <p className="stock-status">
                    {product.stock_quantity > 0 ? (
                      <span className="in-stock">In Stock ({product.stock_quantity})</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </p>
                  <div className="product-actions">
                    <Link to={`/products/${product.id}`} className="btn-secondary">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="btn-primary"
                      disabled={product.stock_quantity === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
